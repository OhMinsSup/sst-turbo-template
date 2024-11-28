import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { AuthErrorDefine } from "../../../routes/auth/errors";
import { WorkspaceSuccessDefine } from "../../../shared/dtos/response/workspaces/workspace-response.dto";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { ListWorkspaceDto } from "../dto/list-workspace.dto";
import { UpdateWorkspaceDto } from "../dto/update-workspace.dto";
import { WorkspaceErrorDefine } from "../errors/workspace-error.service";
import { WorkspacesService } from "../services/workspaces.service";

@ApiTags("워크스페이스")
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: "워크스페이스 생성" })
  @JwtAuth()
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.invalidAuthorizationHeader,
    AuthErrorDefine.notLogin,
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [
    AuthErrorDefine.invalidToken,
    WorkspaceErrorDefine.createWorkspaceValidation,
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.notFoundUser])
  @SuccessResponse(HttpStatus.OK, [WorkspaceSuccessDefine.create])
  create(
    @AuthUser() user: UserExternalPayload,
    @Body() body: CreateWorkspaceDto,
  ) {
    return this.service.create(user, body);
  }

  @Get()
  @ApiOperation({ summary: "워크스페이스 목록" })
  @JwtAuth()
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.invalidAuthorizationHeader,
    AuthErrorDefine.notLogin,
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrorDefine.invalidToken])
  @ErrorResponse(HttpStatus.NOT_FOUND, [AuthErrorDefine.notFoundUser])
  @SuccessResponse(HttpStatus.OK, [])
  findAll(
    @AuthUser() user: UserExternalPayload,
    @Query() query: ListWorkspaceDto,
  ) {
    return this.service.findAll(user, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "워크스페이스 단건 조회" })
  @JwtAuth()
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrorDefine.invalidAuthorizationHeader,
    AuthErrorDefine.notLogin,
  ])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrorDefine.invalidToken])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    AuthErrorDefine.notFoundUser,
    WorkspaceErrorDefine.workspaceNotFound,
  ])
  findOne(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user, id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.service.update(+id, updateWorkspaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
