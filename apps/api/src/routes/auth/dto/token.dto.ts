import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class TokenDTO {
  @IsString({
    message: "잘못된 형식의 토큰입니다.",
  })
  @MinLength(1, {
    message: "토큰은 최소 1글자 이상이어야 합니다.",
  })
  @ApiProperty({
    title: "재발급 토큰",
    description: "재발급 토큰",
    type: "string",
    required: true,
  })
  readonly refreshToken: string;
}
