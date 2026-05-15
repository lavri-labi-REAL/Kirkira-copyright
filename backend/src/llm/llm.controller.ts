import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { LlmService } from "./llm.service";

class ClassifyDto {
  @IsString() description: string;
}

@ApiTags("LLM Classification")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("classify")
export class LlmController {
  constructor(private llm: LlmService) {}

  @Post()
  classify(@Body() dto: ClassifyDto) {
    return this.llm.classifyWork(dto.description);
  }

  @Get("categories")
  categories() {
    return this.llm.getCategories();
  }
}
