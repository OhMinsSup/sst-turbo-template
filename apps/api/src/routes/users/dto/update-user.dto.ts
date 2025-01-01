import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsUrl, MaxLength } from "class-validator";
import { IsOptionalString } from "src/decorators/Is-optional-string.decorator";

import { EmailUserCreateDTO } from "./email-user-create.dto";

export class UpdateUserDto extends PickType(EmailUserCreateDTO, ["username"]) {
  @ApiProperty({
    title: "이미지",
    description: "프로필 이미지",
    nullable: true,
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsOptionalString()
  @IsUrl(undefined, { message: "이미지 URL 형식이 아닙니다." })
  readonly image?: string;

  @ApiProperty({
    title: "firstName",
    description: "유저의 이름",
    example: "John",
    type: "string",
    nullable: true,
    required: false,
  })
  @IsOptionalString()
  @MaxLength(20, {
    message: "이름은 20자 이하여야 합니다.",
  })
  readonly firstName?: string;

  @ApiProperty({
    title: "lastName",
    description: "유저의 성",
    example: "John Doe",
    type: "string",
    nullable: true,
    required: false,
  })
  @IsOptionalString()
  @MaxLength(20, {
    message: "성은 20자 이하여야 합니다.",
  })
  readonly lastName?: string;
}
