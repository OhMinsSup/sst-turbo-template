import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt-auth.guard";
import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { WorkspaceDetailResponseDto } from "../../../shared/dtos/response/workspaces/workspace-detail-response.dto";
import { WorkspaceListResponseDto } from "../../../shared/dtos/response/workspaces/workspace-list-response.dto";
import {
  OpenApiBadRequestErrorDefine,
  OpenApiNotFoundErrorDefine,
  OpenApiUnauthorizedErrorDefine,
} from "../../auth/open-api";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { FavoriteWorkspaceDto } from "../dto/favorite-workspace.dto";
import { ListWorkspaceDto } from "../dto/list-workspace.dto";
import { UpdateWorkspaceDto } from "../dto/update-workspace.dto";
import {
  OpenApiSuccessResponseDefine,
  OpenApiBadRequestErrorDefine as WorkspaceOpenApiBadRequestErrorDefine,
  OpenApiNotFoundErrorDefine as WorkspaceOpenApiNotFoundErrorDefine,
} from "../open-api";
import { WorkspacesService } from "../services/workspaces.service";

@ApiTags("워크스페이스")
@Controller("workspaces")
@ApiExtraModels(
  HttpErrorDto,
  ValidationErrorDto,
  WorkspaceListResponseDto,
  WorkspaceDetailResponseDto,
)
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: "워크스페이스 생성" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(WorkspaceOpenApiBadRequestErrorDefine.create)
  @ApiResponse(OpenApiSuccessResponseDefine.create)
  create(
    @AuthUser() user: UserExternalPayload,
    @Body() body: CreateWorkspaceDto,
  ) {
    return this.service.create(user, body);
  }

  @Get()
  @ApiOperation({ summary: "워크스페이스 목록" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiSuccessResponseDefine.findAll)
  async findAll(
    @AuthUser() user: UserExternalPayload,
    @Query() query: ListWorkspaceDto,
  ) {
    return this.service.findAll(user, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "워크스페이스 단건 조회" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiBadRequestErrorDefine.invalidToken)
  @ApiResponse(WorkspaceOpenApiNotFoundErrorDefine.findOne)
  @ApiResponse(OpenApiSuccessResponseDefine.findOne)
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

  @Patch(":id/favorite")
  @ApiOperation({ summary: "워크스페이스 즐겨찾기" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(WorkspaceOpenApiBadRequestErrorDefine.favorite)
  @ApiResponse(WorkspaceOpenApiNotFoundErrorDefine.findOne)
  @ApiResponse(OpenApiSuccessResponseDefine.favorite)
  favorite(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: FavoriteWorkspaceDto,
  ) {
    return this.service.favorite(user, id, body.isFavorite);
  }
}
