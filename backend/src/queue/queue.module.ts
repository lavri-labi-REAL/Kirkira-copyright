import { Module } from "@nestjs/common";
import { FilingQueueService } from "./filing-queue.service";

@Module({
  providers: [FilingQueueService],
  exports: [FilingQueueService],
})
export class QueueModule {}
