import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { TokensDto } from "../../models/tokens.dto";

export class AuthResponseDto {
  @ApiProperty({
    description: "유저 아이디",
    type: String,
    required: true,
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: "유저 이메일",
    type: String,
    required: true,
  })
  @Expose()
  readonly email: string;

  @ApiProperty({
    description: "유저 이름",
    type: String,
    required: true,
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    description: "유저 이미지",
    type: String,
    nullable: true,
  })
  @Expose()
  readonly image: string | null;

  @ApiProperty({ description: "유저 토큰", type: TokensDto })
  @Type(() => TokensDto)
  @Expose()
  readonly tokens: TokensDto;
}
