/**
 * Nightly Sync Worker — processes sync jobs from BullMQ.
 *
 * Checks status of all active KECOBO applications and downloads
 * certificates for approved ones.
 */

import "dotenv/config";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";
import { KECOBOClient } from "./kecobo-client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const KECOBO_CREDENTIALS = {
  username: process.env.KECOBO_USERNAME || "",
  password: process.env.KECOBO_PASSWORD || "",
  portalUrl: process.env.KECOBO_URL || "https://nrr.copyright.go.ke",
};

async function processSyncJob(job: Job) {
  const { applicationIds } = job.data as { applicationIds: string[] };

  console.log(`[NightlySync] Processing ${applicationIds.length} applications`);

  const client = new KECOBOClient(KECOBO_CREDENTIALS);
  let loginDone = false;

  try {
    await client.launch();
    await client.login();
    loginDone = true;

    for (const appId of applicationIds) {
      await syncApplication(client, appId);
    }
  } catch (err: any) {
    if (!loginDone) {
      console.error("[NightlySync] Login failed:", err.message);
    } else {
      console.error("[NightlySync] Error during sync:", err.message);
    }
    throw err;
  } finally {
    await client.close();
  }

  console.log(`[NightlySync] Completed sync of ${applicationIds.length} applications`);
}

async function syncApplication(client: KECOBOClient, applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application || !application.kecobo_reference) {
    console.warn(`[NightlySync] Skipping ${applicationId}: no KECOBO reference`);
    return;
  }

  console.log(`[NightlySync] Checking ${application.kecobo_reference} — ${application.title}`);

  const result = await client.checkApplicationStatus(
    application.kecobo_reference,
    application.title || ""
  );

  result.applicationId = applicationId;

  const previousStatus = application.status;
  let newStatus = application.status;
  let dbUpdates: any = {
    kecobo_status: result.rawStatus,
    kecobo_last_checked_at: new Date(),
  };

  switch (result.status) {
    case "submitted":
      newStatus = "SUBMITTED";
      break;
    case "under_review":
      newStatus = "UNDER_REVIEW";
      break;
    case "approved":
      newStatus = "APPROVED";
      break;
    case "rejected":
      newStatus = "REJECTED";
      dbUpdates.rejection_reason = result.rejectionReason;
      break;
    default:
      break;
  }

  const statusChanged = newStatus !== previousStatus;

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: newStatus as any, ...dbUpdates },
  });

  if (statusChanged) {
    await prisma.auditLog.create({
      data: {
        application_id: applicationId,
        from_status: previousStatus as any,
        to_status: newStatus as any,
        triggered_by: "scheduler",
        note: `Nightly sync: KECOBO status is "${result.rawStatus}"`,
      },
    });
    console.log(`[NightlySync] ${applicationId}: ${previousStatus} → ${newStatus}`);
  }

  // Store certificate PDF if approved
  if (result.status === "approved" && result.certificatePath && fs.existsSync(result.certificatePath)) {
    const existingCert = await prisma.applicationDocument.findFirst({
      where: { application_id: applicationId, type: "CERTIFICATE" },
    });

    if (!existingCert) {
      const certSize = fs.statSync(result.certificatePath).size;
      await prisma.applicationDocument.create({
        data: {
          application_id: applicationId,
          type: "CERTIFICATE",
          document_id: "kecobo_certificate",
          label: "KECOBO Copyright Certificate",
          file_path: result.certificatePath,
          file_name: `certificate_${application.kecobo_reference}.pdf`,
          mime_type: "application/pdf",
          size_bytes: certSize,
        },
      });
      console.log(`[NightlySync] Certificate stored for ${applicationId}`);
    }
  }
}

// Start the sync worker
const worker = new Worker("kecobo-sync", processSyncJob, {
  connection: redis,
  concurrency: 1, // Sync runs sequentially (single browser session)
});

worker.on("completed", (job) => {
  console.log(`[NightlySync] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[NightlySync] Job ${job?.id} failed: ${err.message}`);
});

worker.on("error", (err) => {
  console.error("[NightlySync] Worker error:", err);
});

console.log("[NightlySync] Started — listening for sync jobs...");

process.on("SIGTERM", async () => {
  await worker.close();
  await redis.quit();
  await prisma.$disconnect();
  process.exit(0);
});
