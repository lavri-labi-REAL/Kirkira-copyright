import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FilingQueueService } from "../queue/filing-queue.service";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private queue: FilingQueueService
  ) {}

  async create(userId: string) {
    return this.prisma.application.create({
      data: { user_id: userId, status: "DRAFT", wizard_step: 1 },
      include: { documents: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.application.findMany({
      where: { user_id: userId },
      include: { documents: true },
      orderBy: { updated_at: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id },
      include: { documents: true, audit_logs: { orderBy: { created_at: "desc" } } },
    });
    if (!app) throw new NotFoundException("Application not found");
    if (app.user_id !== userId) throw new ForbiddenException();
    return app;
  }

  async update(id: string, userId: string, dto: UpdateApplicationDto) {
    await this.findOne(id, userId);
    return this.prisma.application.update({
      where: { id },
      data: {
        ...(dto.wizard_step !== undefined && { wizard_step: dto.wizard_step }),
        ...(dto.category_id !== undefined && { category_id: dto.category_id }),
        ...(dto.subcategory_id !== undefined && { subcategory_id: dto.subcategory_id }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.applicant_profile_snapshot !== undefined && {
          applicant_profile_snapshot: dto.applicant_profile_snapshot as Prisma.InputJsonValue,
        }),
        ...(dto.owners !== undefined && {
          owners: dto.owners as Prisma.InputJsonValue,
        }),
        ...(dto.work_metadata !== undefined && {
          work_metadata: dto.work_metadata as Prisma.InputJsonValue,
        }),
      },
      include: { documents: true },
    });
  }

  async confirmFiling(id: string, userId: string) {
    const app = await this.findOne(id, userId);

    if (app.status !== "DRAFT" && app.status !== "REJECTED") {
      throw new BadRequestException(`Cannot file application with status: ${app.status}`);
    }

    this.validateReadyForFiling(app);

    // Transition to READY_FOR_FILING
    const updated = await this.prisma.application.update({
      where: { id },
      data: { status: "READY_FOR_FILING" },
    });

    await this.prisma.auditLog.create({
      data: {
        application_id: id,
        from_status: app.status as ApplicationStatus,
        to_status: "READY_FOR_FILING",
        triggered_by: "user",
        note: "User confirmed filing",
      },
    });

    // Enqueue the Playwright filing job
    const job = await this.prisma.filingJob.create({
      data: {
        application_id: id,
        job_type: app.status === "REJECTED" ? "RESUBMISSION" : "INITIAL_FILING",
        status: "QUEUED",
      },
    });

    await this.queue.enqueueFilingJob({ applicationId: id, jobId: job.id });

    return updated;
  }

  async delete(id: string, userId: string) {
    const app = await this.findOne(id, userId);
    if (app.status !== "DRAFT") {
      throw new BadRequestException("Only draft applications can be deleted");
    }
    await this.prisma.application.delete({ where: { id } });
    return { deleted: true };
  }

  async transitionStatus(
    id: string,
    toStatus: ApplicationStatus,
    triggeredBy: string,
    note?: string,
    extra?: Partial<{
      kecobo_reference: string;
      kecobo_status: string;
      kecobo_last_checked_at: Date;
      rejection_reason: string;
    }>
  ) {
    const app = await this.prisma.application.findUniqueOrThrow({ where: { id } });

    await this.prisma.application.update({
      where: { id },
      data: { status: toStatus, kecobo_last_checked_at: new Date(), ...extra },
    });

    await this.prisma.auditLog.create({
      data: {
        application_id: id,
        from_status: app.status,
        to_status: toStatus,
        triggered_by: triggeredBy,
        note,
      },
    });
  }

  private validateReadyForFiling(app: any) {
    const missing: string[] = [];
    if (!app.title) missing.push("title");
    if (!app.category_id) missing.push("category");
    if (!app.subcategory_id) missing.push("subcategory");
    if (!app.applicant_profile_snapshot) missing.push("applicant profile");

    const docs = app.documents as any[];
    const hasWorkFile = docs.some((d: any) => d.type === "WORK_FILE");
    const hasIdDoc = docs.some((d: any) => d.type === "ID_DOCUMENT");
    if (!hasWorkFile) missing.push("work file document");
    if (!hasIdDoc) missing.push("ID document");

    if (missing.length) {
      throw new BadRequestException(`Missing required fields: ${missing.join(", ")}`);
    }
  }
}
