import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DocumentsService } from "./documents.service";
import * as fs from "fs";

@ApiTags("Documents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("applications/:applicationId/documents")
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } }))
  upload(
    @Param("applicationId") applicationId: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body("document_id") documentId: string,
    @Body("label") label: string,
    @Body("type") type: string
  ) {
    return this.svc.upload(applicationId, req.user.sub, documentId, label, type, file);
  }

  @Delete(":documentId")
  remove(@Param("documentId") documentId: string, @Request() req: any) {
    return this.svc.delete(documentId, req.user.sub);
  }
}
