import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiConsumes } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { DocumentsService } from "./documents.service";

@ApiTags("Documents")
@Controller("applications/:applicationId/documents")
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } }))
  upload(
    @Param("applicationId") applicationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("document_id") documentId: string,
    @Body("label") label: string,
    @Body("type") type: string
  ) {
    return this.svc.upload(applicationId, documentId, label, type, file);
  }

  @Delete(":documentId")
  remove(@Param("documentId") documentId: string) {
    return this.svc.delete(documentId);
  }
}
