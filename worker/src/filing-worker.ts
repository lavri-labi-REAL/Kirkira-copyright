/**
 * Filing Worker — processes queued filing jobs from BullMQ.
 *
 * Each job picks up an application from the database, launches the
 * KECOBOClient, files the application, and writes the result back.
 */

import "dotenv/config";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { KECOBOClient, ApplicationData } from "./kecobo-client";

const prisma = new PrismaClient();

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const KECOBO_CREDENTIALS = {
  username: process.env.KECOBO_USERNAME || "",
  password: process.env.KECOBO_PASSWORD || "",
  portalUrl: process.env.KECOBO_URL || "https://nrr.copyright.go.ke",
};

async function processFilingJob(job: Job) {
  const { applicationId, jobId } = job.data;

  console.log(`[FilingWorker] Processing job ${job.id} for application ${applicationId}`);

  // Mark job as processing
  await prisma.filingJob.update({
    where: { id: jobId },
    data: { status: "PROCESSING", started_at: new Date(), bull_job_id: job.id },
  });

  // Fetch full application data
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    include: { documents: true },
  });

  const appData: ApplicationData = {
    id: application.id,
    title: application.title || "",
    description: application.description || "",
    category_id: application.category_id || "",
    subcategory_id: application.subcategory_id || "",
    applicant_profile_snapshot: application.applicant_profile_snapshot as any,
    owners: (application.owners as any) || [],
    work_metadata: (application.work_metadata as any) || {},
    documents: application.documents.map((d) => ({
      id: d.id,
      type: d.type,
      document_id: d.document_id,
      label: d.label,
      file_path: d.file_path,
      file_name: d.file_name,
      mime_type: d.mime_type,
    })),
  };

  const client = new KECOBOClient(KECOBO_CREDENTIALS);

  try {
    await client.launch();
    await client.login();

    const result = await client.fileApplication(appData);

    if (result.success) {
      // Update application status to SUBMITTED
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: "SUBMITTED",
          kecobo_reference: result.reference,
          kecobo_status: "submitted",
          kecobo_last_checked_at: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          application_id: applicationId,
          from_status: "READY_FOR_FILING",
          to_status: "SUBMITTED",
          triggered_by: "worker",
          note: `Filed successfully. KECOBO Reference: ${result.reference}`,
        },
      });

      // Save screenshot as a document
      if (result.screenshotPath) {
        await prisma.applicationDocument.create({
          data: {
            application_id: applicationId,
            type: "SCREENSHOT",
            document_id: "filing_screenshot",
            label: "Filing Confirmation Screenshot",
            file_path: result.screenshotPath,
            file_name: "filing_confirmation.png",
            mime_type: "image/png",
            size_bytes: 0,
          },
        });
      }

      await prisma.filingJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED", completed_at: new Date() },
      });

      console.log(`[FilingWorker] Application ${applicationId} filed. Ref: ${result.reference}`);
    } else {
      throw new Error(result.error || "Filing returned failure with no error message");
    }
  } catch (err: any) {
    console.error(`[FilingWorker] Job ${job.id} failed: ${err.message}`);

    await prisma.filingJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: err.message,
        attempts: { increment: 1 },
        completed_at: new Date(),
      },
    });

    // Revert status to DRAFT if all retries exhausted
    if (job.attemptsMade >= (job.opts.attempts || 3) - 1) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "DRAFT" },
      });

      await prisma.auditLog.create({
        data: {
          application_id: applicationId,
          from_status: "READY_FOR_FILING",
          to_status: "DRAFT",
          triggered_by: "worker",
          note: `Filing failed after ${job.attemptsMade + 1} attempts: ${err.message}`,
        },
      });
    }

    throw err; // Re-throw so BullMQ triggers retry
  } finally {
    await client.close();
  }
}

// Start the worker
const worker = new Worker("kecobo-filing", processFilingJob, {
  connection: redis,
  concurrency: 2, // Max 2 concurrent browser sessions
});

worker.on("completed", (job) => {
  console.log(`[FilingWorker] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[FilingWorker] Job ${job?.id} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("[FilingWorker] Worker error:", err);
});

console.log("[FilingWorker] Started — listening for filing jobs...");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[FilingWorker] SIGTERM received, shutting down...");
  await worker.close();
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});
