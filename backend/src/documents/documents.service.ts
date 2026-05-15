import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES: Record<string, string[]> = {
  "work_file": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "audio/mpeg", "audio/wav", "audio/x-aiff", "video/mp4", "video/quicktime", "image/jpeg", "image/png", "image/tiff", "application/zip"],
  "id_document": ["image/jpeg", "image/png", "application/pdf"],
  "declaration_form": ["application/pdf"],
  "supporting": ["application/pdf", "image/jpeg", "image/png", "application/zip"],
};

@Injectable()
export class DocumentsService {
  private storagePath: string;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.storagePath = config.get("STORAGE_LOCAL_PATH", "./uploads");
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  async upload(
    applicationId: string,
    userId: string,
    documentId: string,
    label: string,
    type: string,
    file: Express.Multer.File
  ) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException("Application not found");
    if (app.user_id !== userId) throw new ForbiddenException();

    const allowedMimes = ALLOWED_TYPES[type] || ALLOWED_TYPES["supporting"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed for document type: ${type}`);
    }

    const ext = path.extname(file.originalname);
    const storedName = `${uuidv4()}${ext}`;
    const appDir = path.join(this.storagePath, applicationId);
    if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

    const filePath = path.join(appDir, storedName);
    fs.writeFileSync(filePath, file.buffer);

    // Remove existing document of same type+documentId
    await this.prisma.applicationDocument.deleteMany({
      where: { application_id: applicationId, document_id: documentId },
    });

    return this.prisma.applicationDocument.create({
      data: {
        application_id: applicationId,
        type: this.mapDocumentType(type),
        document_id: documentId,
        label,
        file_path: filePath,
        file_name: file.originalname,
        mime_type: file.mimetype,
        size_bytes: file.size,
      },
    });
  }

  async delete(documentId: string, userId: string) {
    const doc = await this.prisma.applicationDocument.findUnique({
      where: { id: documentId },
      include: { application: true },
    });
    if (!doc) throw new NotFoundException();
    if (doc.application.user_id !== userId) throw new ForbiddenException();

    if (fs.existsSync(doc.file_path)) fs.unlinkSync(doc.file_path);
    await this.prisma.applicationDocument.delete({ where: { id: documentId } });
    return { deleted: true };
  }

  getFilePath(filePath: string): string {
    return filePath;
  }

  private mapDocumentType(type: string): any {
    const map: Record<string, string> = {
      work_file: "WORK_FILE",
      id_document: "ID_DOCUMENT",
      declaration_form: "DECLARATION_FORM",
      supporting: "SUPPORTING",
      certificate: "CERTIFICATE",
    };
    return map[type] || "SUPPORTING";
  }
}
