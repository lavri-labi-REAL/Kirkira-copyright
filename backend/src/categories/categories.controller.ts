import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import * as categoriesSchema from "../../data/categories.json";

@ApiTags("Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("categories")
export class CategoriesController {
  @Get()
  getAll() {
    return (categoriesSchema as any).categories;
  }

  @Get("schema")
  getSchema() {
    return categoriesSchema;
  }

  @Get(":categoryId")
  getCategory(@Param("categoryId") categoryId: string) {
    const cat = (categoriesSchema as any).categories.find((c: any) => c.id === categoryId);
    return cat || null;
  }

  @Get(":categoryId/subcategories/:subcategoryId")
  getSubcategory(
    @Param("categoryId") categoryId: string,
    @Param("subcategoryId") subcategoryId: string
  ) {
    const cat = (categoriesSchema as any).categories.find((c: any) => c.id === categoryId);
    if (!cat) return null;
    return cat.subcategories.find((s: any) => s.id === subcategoryId) || null;
  }

  @Get("common-fields")
  getCommonFields() {
    return (categoriesSchema as any).common_fields;
  }

  @Get("common-documents")
  getCommonDocuments() {
    return (categoriesSchema as any).common_documents;
  }
}
