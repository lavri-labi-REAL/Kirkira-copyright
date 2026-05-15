import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApplicationsService } from "./applications.service";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@ApiTags("Applications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("applications")
export class ApplicationsController {
  constructor(private svc: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new draft application" })
  create(@Request() req: any) {
    return this.svc.create(req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: "List all applications for the authenticated user" })
  findAll(@Request() req: any) {
    return this.svc.findAll(req.user.sub);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single application with documents and audit log" })
  findOne(@Param("id") id: string, @Request() req: any) {
    return this.svc.findOne(id, req.user.sub);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Auto-save wizard step data" })
  update(
    @Param("id") id: string,
    @Request() req: any,
    @Body() dto: UpdateApplicationDto
  ) {
    return this.svc.update(id, req.user.sub, dto);
  }

  @Post(":id/confirm-filing")
  @ApiOperation({ summary: "Confirm and queue the application for filing" })
  confirmFiling(@Param("id") id: string, @Request() req: any) {
    return this.svc.confirmFiling(id, req.user.sub);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a draft application" })
  remove(@Param("id") id: string, @Request() req: any) {
    return this.svc.delete(id, req.user.sub);
  }
}
