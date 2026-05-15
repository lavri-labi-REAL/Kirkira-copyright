import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { FilingQueueService } from "../queue/filing-queue.service";

@Injectable()
export class NightlySyncScheduler {
  private readonly logger = new Logger(NightlySyncScheduler.name);

  constructor(
    private prisma: PrismaService,
    private queue: FilingQueueService,
    private config: ConfigService
  ) {}

  // Default: 9 PM UTC = midnight EAT (UTC+3)
  @Cron(process.env.NIGHTLY_SYNC_CRON || "0 21 * * *")
  async runNightlySync() {
    this.logger.log("Starting nightly KECOBO sync...");

    const activeApplications = await this.prisma.application.findMany({
      where: {
        status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
        kecobo_reference: { not: null },
      },
      select: { id: true },
    });

    if (activeApplications.length === 0) {
      this.logger.log("No active applications to sync");
      return;
    }

    const applicationIds = activeApplications.map((a) => a.id);
    this.logger.log(`Syncing ${applicationIds.length} applications`);

    await this.queue.enqueueSyncJob({ applicationIds });
  }

  // Also expose a manual trigger endpoint via a controller
  async triggerManualSync() {
    this.logger.log("Manual sync triggered");
    return this.runNightlySync();
  }
}
