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
import { WorkspaceDeleteResponseDto } from "../../../shared/dtos/response/workspaces/workspace-delete-response.dto";
import { WorkspaceDetailResponseDto } from "../../../shared/dtos/response/workspaces/workspace-detail-response.dto";
import { WorkspaceListResponseDto } from "../../../shared/dtos/response/workspaces/workspace-list-response.dto";
import {
  OpenApiAuthBadRequestErrorDefine,
  OpenApiAuthNotFoundErrorDefine,
  OpenApiAuthUnauthorizedErrorDefine,
} from "../../auth/open-api";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { FavoriteWorkspaceDto } from "../dto/favorite-workspace.dto";
import { ListDeletedWorkspaceDto } from "../dto/list-deleted-workspace.dto";
import { ListWorkspaceDto } from "../dto/list-workspace.dto";
import { UpdateWorkspaceDto } from "../dto/update-workspace.dto";
import {
  OpenApiWorkspaceBadRequestErrorDefine,
  OpenApiWorkspaceNotFoundErrorDefine,
  OpenApiWorkspaceSuccessResponseDefine,
} from "../open-api";
import { WorkspacesService } from "../services/workspaces.service";

@ApiTags("워크스페이스")
@Controller("workspaces")
@ApiExtraModels(
  HttpErrorDto,
  ValidationErrorDto,
  WorkspaceListResponseDto,
  WorkspaceDetailResponseDto,
  WorkspaceDeleteResponseDto,
)
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: "워크스페이스 생성" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiWorkspaceBadRequestErrorDefine.create)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.create)
  create(
    @AuthUser() user: UserExternalPayload,
    @Body() body: CreateWorkspaceDto,
  ) {
    return this.service.create(user, body);
  }

  @Get()
  @ApiOperation({ summary: "워크스페이스 목록" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiAuthBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.findAll)
  async findMany(
    @AuthUser() user: UserExternalPayload,
    @Query() query: ListWorkspaceDto,
  ) {
    return this.service.findMany(user, query);
  }

  @Get("deleted")
  @ApiOperation({ summary: "삭제된 워크스페이스 목록" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiAuthBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.findAll)
  findManyByDeleted(
    @AuthUser() user: UserExternalPayload,
    @Query() query: ListDeletedWorkspaceDto,
  ) {
    return this.service.findManyByDeleted(user, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "워크스페이스 단건 조회" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiAuthBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiWorkspaceNotFoundErrorDefine.findOne)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.findOne)
  findOne(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.findOne(user, id);
  }

  @Patch(":id")
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiWorkspaceBadRequestErrorDefine.update)
  @ApiResponse(OpenApiWorkspaceNotFoundErrorDefine.findOne)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.findOne)
  update(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.service.update(user, id, updateWorkspaceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "워크스페이스 삭제 (soft delete)" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiAuthNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiAuthBadRequestErrorDefine.invalidToken)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.delete)
  remove(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.service.remove(user, id);
  }

  @Patch(":id/favorite")
  @ApiOperation({ summary: "워크스페이스 즐겨찾기" })
  @JwtAuth()
  @ApiResponse(OpenApiAuthUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiWorkspaceBadRequestErrorDefine.favorite)
  @ApiResponse(OpenApiWorkspaceNotFoundErrorDefine.findOne)
  @ApiResponse(OpenApiWorkspaceSuccessResponseDefine.favorite)
  favorite(
    @AuthUser() user: UserExternalPayload,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: FavoriteWorkspaceDto,
  ) {
    return this.service.favorite(user, id, body.isFavorite);
  }
}
