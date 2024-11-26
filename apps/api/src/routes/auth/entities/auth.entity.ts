import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { UserEntity } from "../../users/entities/user.entity";

export class AuthEntity {
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
    description: "토큰타입",
    example: "Bearer",
    type: String,
    required: true,
  })
  @Expose()
  readonly tokenType: string;

  @ApiProperty({
    description: "만료시간",
    example: "30m",
    type: String,
    required: true,
  })
  @Expose()
  readonly expiresIn: string;

  @ApiProperty({
    description: "만료일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly expiresAt: Date;

  @ApiProperty({ description: "Refresh 토큰", type: String })
  @Expose()
  readonly refreshToken: string;

  @ApiProperty({
    description: "세션 유저 정보",
    type: UserEntity,
  })
  @Type(() => UserEntity)
  @Expose()
  readonly user: UserEntity;
}
