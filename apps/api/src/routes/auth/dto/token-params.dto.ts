import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum GrantType {
  REFRESH_TOKEN = "refresh_token",
}

export class TokenParamsDTO {
  @IsEnum(GrantType)
  @IsOptional()
  @ApiProperty({
    title: "검증 타입",
    description: "검증 타입",
    example: GrantType.REFRESH_TOKEN,
    type: "string",
    enum: GrantType,
    required: true,
  })
  readonly grant_type: GrantType;
}
