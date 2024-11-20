import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum GrantType {
  REFRESH_TOKEN = "refresh_token",
}

export class TokenQueryDTO {
  @IsEnum(GrantType)
  @ApiProperty({
    title: "검증 타입",
    description: "검증 타입",
    example: GrantType.REFRESH_TOKEN,
    type: "string",
    enum: GrantType,
  })
  readonly grantType: GrantType;
}
