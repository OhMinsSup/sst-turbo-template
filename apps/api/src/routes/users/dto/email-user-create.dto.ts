import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";
import { IsOptionalString } from "src/decorators/Is-optional-string.decorator";

import { UserPasswordDTO } from "./user-password.dto";

export class EmailUserCreateDTO extends UserPasswordDTO {
  @IsNotEmpty()
  @IsEmail(undefined, { message: "잘못된 이메일 형식입니다." })
  @ApiProperty({
    title: "Email",
    description: "이메일 주소",
    example: "example@example.com",
    type: "string",
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    title: "Usernaem",
    description: "유저의 이름",
    example: "John Doe",
    type: "string",
    nullable: true,
    required: false,
  })
  @IsOptionalString({
    message: "이름은 문자열이어야 합니다.",
  })
  @MaxLength(50, {
    message: "이름은 50자 이하여야 합니다.",
  })
  readonly username?: string;
}
