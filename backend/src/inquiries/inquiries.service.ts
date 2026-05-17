import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: {
    full_name: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    description: string;
    notes?: string;
  }) {
    const inquiry = await this.prisma.inquiry.create({ data });
    this.logger.log(`New inquiry: ${inquiry.service} from ${inquiry.email} (id: ${inquiry.id})`);
    return inquiry;
  }

  findAll() {
    return this.prisma.inquiry.findMany({ orderBy: { created_at: "desc" } });
  }
}
