import { Controller, Post, Get, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, MinLength } from "class-validator";
import { InquiriesService } from "./inquiries.service";

class CreateInquiryDto {
  @IsString() full_name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() company?: string;
  @IsString() service: string;
  @IsString() @MinLength(20) description: string;
  @IsOptional() @IsString() notes?: string;
}

@ApiTags("Inquiries")
@Controller("inquiries")
export class InquiriesController {
  constructor(private svc: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: "Submit a service inquiry" })
  create(@Body() dto: CreateInquiryDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all inquiries" })
  findAll() {
    return this.svc.findAll();
  }
}
