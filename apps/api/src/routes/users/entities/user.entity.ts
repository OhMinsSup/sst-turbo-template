import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { RoleEntity } from "./role.entity";
import { UserProfileEntity } from "./user-profile.entity";

export class UserEntity {
  @ApiProperty({
    title: "ID",
    description: "사용자 ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: true,
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    title: "이메일",
    description: "사용자 이메일",
    example: "test@naver.com",
    required: true,
  })
  @Expose()
  readonly email: string;

  @ApiProperty({
    title: "이름",
    description: "사용자 이름",
    example: "홍길동",
    required: true,
  })
  @Expose()
  readonly username: string;

  @ApiProperty({
    title: "이메일 확인 일시",
    description: "이메일 확인 일시",
    type: Date,
    required: false,
    format: "date-time",
  })
  @Expose()
  readonly emailConfirmedAt: Date | null;

  @ApiProperty({
    title: "정지 여부",
    description: "정지 여부",
    example: false,
    required: true,
  })
  @Expose()
  readonly isSuspended: boolean;

  @ApiProperty({
    title: "삭제일",
    description: "삭제일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly deletedAt: Date;

  @ApiProperty({ description: "역할", type: RoleEntity })
  @Type(() => RoleEntity)
  @Expose()
  readonly Role: RoleEntity;

  @ApiProperty({ description: "프로필", type: UserProfileEntity })
  @Type(() => UserProfileEntity)
  @Expose()
  readonly UserProfile: UserProfileEntity;
}
