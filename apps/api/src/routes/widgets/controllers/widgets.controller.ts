import { Controller, Get, Query } from "@nestjs/common";
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
import { WidgetWorkspaceListResponseDto } from "../../../shared/dtos/response/widgets/widget-workspace-list-response.dto";
import {
  OpenApiBadRequestErrorDefine,
  OpenApiNotFoundErrorDefine,
  OpenApiUnauthorizedErrorDefine,
} from "../../auth/open-api";
import { ListWorkspaceWidgetDto } from "../dto/list-workspace-widget.dto";
import { OpenApiSuccessResponseDefine as WidgetOpenApiSuccessResponseDefine } from "../open-api";
import { WidgetsService } from "../services/widgets.service";

@ApiTags("위젯")
@Controller("widgets")
@ApiExtraModels(
  HttpErrorDto,
  ValidationErrorDto,
  WidgetWorkspaceListResponseDto,
)
export class WidgetsController {
  constructor(private readonly service: WidgetsService) {}

  @Get("workspaces")
  @ApiOperation({ summary: "워크스페이스 위젯 목록 조회" })
  @JwtAuth()
  @ApiResponse(OpenApiUnauthorizedErrorDefine.logout)
  @ApiResponse(OpenApiNotFoundErrorDefine.notFoundUser)
  @ApiResponse(OpenApiBadRequestErrorDefine.invalidToken)
  @ApiResponse(WidgetOpenApiSuccessResponseDefine.findAll)
  findAllByWidgetWorkspace(
    @AuthUser() user: UserExternalPayload,
    @Query() query: ListWorkspaceWidgetDto,
  ) {
    return this.service.findAllByWidgetWorkspace(user, query);
  }
}
