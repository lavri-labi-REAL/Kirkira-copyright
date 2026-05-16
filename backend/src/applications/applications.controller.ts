import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ApplicationsService } from "./applications.service";
import { UpdateApplicationDto } from "./dto/update-application.dto";

// Auth is handled by the parent Kira platform.
// All requests run as the shared guest user until platform integration injects a real user ID.
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000001";

@ApiTags("Applications")
@Controller("applications")
export class ApplicationsController {
  constructor(private svc: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new draft application" })
  create() {
    return this.svc.create(GUEST_USER_ID);
  }

  @Get()
  @ApiOperation({ summary: "List all applications" })
  findAll() {
    return this.svc.findAll(GUEST_USER_ID);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single application" })
  findOne(@Param("id") id: string) {
    return this.svc.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Auto-save wizard step data" })
  update(@Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.svc.update(id, dto);
  }

  @Post(":id/confirm-filing")
  @ApiOperation({ summary: "Confirm and queue the application for filing" })
  confirmFiling(@Param("id") id: string) {
    return this.svc.confirmFiling(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a draft application" })
  remove(@Param("id") id: string) {
    return this.svc.delete(id);
  }
}
