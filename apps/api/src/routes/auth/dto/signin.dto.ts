import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { Provider } from "@template/common";

import { EmailUserCreateDTO } from "../../users/dto/email-user-create.dto";

export class SignInDTO extends PickType(EmailUserCreateDTO, [
  "email",
  "password",
]) {
  @IsEnum(Provider, { message: "잘못된 인증 방식입니다." })
  @ApiProperty({
    title: "Provider",
    description: "인증 방식",
    example: "email",
    enum: Provider,
    required: true,
  })
  readonly provider: Provider;
}
