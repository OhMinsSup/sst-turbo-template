import { ApiProperty } from "@nestjs/swagger";
import { ProviderEnum } from "@veloss/constants/auth";
import { IsEnum } from "class-validator";

import { EmailUserCreateDTO } from "../../users/dto/email-user-create.dto";

export class SignUpDTO extends EmailUserCreateDTO {
  @IsEnum(ProviderEnum, { message: "잘못된 인증 방식입니다." })
  @ApiProperty({
    title: "Provider",
    description: "인증 방식",
    example: "email",
    enum: ProviderEnum,
    required: true,
  })
  readonly provider: ProviderEnum;
}
