import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";

export interface FilingJobPayload {
  applicationId: string;
  jobId: string;
}

export interface SyncJobPayload {
  applicationIds: string[];
}

@Injectable()
export class FilingQueueService implements OnModuleInit {
  private readonly logger = new Logger(FilingQueueService.name);
  private connection: IORedis;
  private filingQueue: Queue;
  private syncQueue: Queue;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.config.get("REDIS_URL", "redis://localhost:6379");
    this.connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

    this.filingQueue = new Queue("kecobo-filing", { connection: this.connection });
    this.syncQueue = new Queue("kecobo-sync", { connection: this.connection });

    this.logger.log("Filing queue and sync queue initialised");
  }

  async enqueueFilingJob(payload: FilingJobPayload) {
    const job = await this.filingQueue.add("file-application", payload, {
      attempts: 3,
      backoff: { type: "exponential", delay: 30000 },
      removeOnComplete: 100,
      removeOnFail: 200,
    });
    this.logger.log(`Enqueued filing job ${job.id} for application ${payload.applicationId}`);
    return job.id;
  }

  async enqueueSyncJob(payload: SyncJobPayload) {
    const job = await this.syncQueue.add("nightly-sync", payload, {
      attempts: 2,
      backoff: { type: "fixed", delay: 60000 },
    });
    this.logger.log(`Enqueued sync job ${job.id} for ${payload.applicationIds.length} applications`);
    return job.id;
  }

  async getFilingQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.filingQueue.getWaitingCount(),
      this.filingQueue.getActiveCount(),
      this.filingQueue.getCompletedCount(),
      this.filingQueue.getFailedCount(),
    ]);
    return { waiting, active, completed, failed };
  }
}
