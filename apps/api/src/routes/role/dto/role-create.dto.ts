import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

import { Role } from "@template/common";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";

export class RoleCreateDTO {
  @IsString({
    message: "이름은 문자열이어야 합니다.",
  })
  @MinLength(1, {
    message: "이름은 1자 이상이어야 합니다.",
  })
  @MaxLength(100, {
    message: "이름은 100자 이하여야 합니다.",
  })
  @ApiProperty({
    title: "Role 이름",
    description: "Role의 이름",
    maxLength: 100,
    minLength: 1,
    type: "string",
    required: true,
  })
  readonly name: string;

  @IsEnum(Role, {
    message: "Role은 ADMIN 또는 USER여야 합니다.",
  })
  @ApiProperty({
    title: "Role 심볼",
    description: "Role의 심볼",
    enum: Role,
    required: true,
  })
  readonly symbol: Role;

  @IsOptionalString()
  @MaxLength(200, {
    message: "설명은 200자 이하여야 합니다.",
  })
  @ApiProperty({
    title: "Role 설명",
    description: "Role의 설명",
    maxLength: 200,
    type: "string",
    required: false,
  })
  readonly description?: string;
}
