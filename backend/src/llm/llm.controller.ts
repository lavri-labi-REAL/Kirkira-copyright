import { Controller, Post, Get, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { LlmService } from "./llm.service";

class ClassifyDto {
  @IsString() description: string;
}

@ApiTags("LLM Classification")
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
