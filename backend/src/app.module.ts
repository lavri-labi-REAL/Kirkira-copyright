import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ApplicationsModule } from "./applications/applications.module";
import { DocumentsModule } from "./documents/documents.module";
import { LlmModule } from "./llm/llm.module";
import { QueueModule } from "./queue/queue.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { CategoriesModule } from "./categories/categories.module";
import { InquiriesModule } from "./inquiries/inquiries.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ApplicationsModule,
    DocumentsModule,
    LlmModule,
    QueueModule,
    SchedulerModule,
    CategoriesModule,
    InquiriesModule,
  ],
})
export class AppModule {}
