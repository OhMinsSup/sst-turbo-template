import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsUrl } from "class-validator";
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
}
