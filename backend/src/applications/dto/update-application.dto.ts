import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  Min,
  Max,
} from "class-validator";

export class UpdateApplicationDto {
  @IsOptional() @IsNumber() @Min(1) @Max(7)
  wizard_step?: number;

  @IsOptional() @IsString()
  category_id?: string;

  @IsOptional() @IsString()
  subcategory_id?: string;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsObject()
  applicant_profile_snapshot?: Record<string, any>;

  @IsOptional() @IsArray()
  owners?: Record<string, any>[];

  @IsOptional() @IsObject()
  work_metadata?: Record<string, any>;
}
