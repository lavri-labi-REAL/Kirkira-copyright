import { Module } from "@nestjs/common";
import { NightlySyncScheduler } from "./nightly-sync.scheduler";
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [QueueModule],
  providers: [NightlySyncScheduler],
})
export class SchedulerModule {}
