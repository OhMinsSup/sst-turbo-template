import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class TokenDto {
  @ApiProperty({
    description: "토큰",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    type: String,
    required: true,
  })
  @Expose()
  readonly token: string;

  @ApiProperty({
    description: "만료일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly expiresAt: Date;
}

export class TokensDto {
  @ApiProperty({ description: "인증 토큰", type: TokenDto })
  @Type(() => TokenDto)
  @Expose()
  readonly accessToken: TokenDto;

  @ApiProperty({ description: "갱신 토큰", type: TokenDto })
  @Type(() => TokenDto)
  @Expose()
  readonly refreshToken: TokenDto;
}
