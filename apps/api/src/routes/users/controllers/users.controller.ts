import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { ErrorResponse } from "../../../decorators/error-response.decorator";
import { SuccessResponse } from "../../../decorators/success-response.decorator";
import { JwtAuth } from "../../../guards/jwt.auth.guard";
import { OptionalJwtAuth } from "../../../guards/optional-jwt.auth.guard";
import { UserExternalResponseDto } from "../../../shared/dtos/response/users/user-response.dto";
import { UserErrorDefine, UserNotExistErrorCode } from "../errors";
import { UsersService } from "../services/users.service";

@ApiTags("사용자")
@Controller("users")
@JwtAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "로그인 사용자 정보" })
  @JwtAuth()
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserExternalResponseDto,
      exampleDescription: "로그인 사용자 정보 조회에 성공한 경우 발생하는 응답",
      exampleTitle: "로그인 사용자 정보 조회 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  me(@AuthUser() user: UserExternalPayload) {
    return this.service.me(user);
  }

  @Get(":id")
  @ApiOperation({ summary: "아이디로 사용자 정보 조회" })
  @OptionalJwtAuth()
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserExternalResponseDto,
      exampleDescription:
        "아이디로 사용자 정보 조회에 성공한 경우 발생하는 응답",
      exampleTitle: "아이디로 사용자 정보 조회 성공",
      resultCode: HttpResultCode.OK,
    },
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [UserErrorDefine[UserNotExistErrorCode]])
  async byUserId(@Param("id") id: string) {
    return this.service.byUserId(id);
  }
}
