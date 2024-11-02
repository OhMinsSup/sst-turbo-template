import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { UserProfile, UserSettings } from "@template/db";
import { UserExternalPayload } from "@template/db/selectors";

class UserProfileDto implements Pick<UserProfile, "bio" | "website"> {
  @ApiProperty({
    description: "사용자 자기 소개",
    type: "string",
    nullable: true,
  })
  @Expose()
  readonly bio: string | null;

  @ApiProperty({
    description: "사용자 웹사이트",
    type: "string",
    nullable: true,
  })
  @Expose()
  readonly website: string | null;
}

class UserSettingsDto implements Pick<UserSettings, "privacySettings"> {
  @ApiProperty({
    description: "사용자 개인 정보 설정",
    type: Boolean,
    required: true,
  })
  @Expose()
  readonly privacySettings: boolean;
}

export class UserExternalResponseDto implements UserExternalPayload {
  @ApiProperty({
    type: "string",
    description: "사용자 아이디",
    required: true,
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: "사용자 이름",
    type: "string",
    required: true,
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    description: "사용자 이메일",
    type: "string",
    required: true,
  })
  @Expose()
  readonly email: string;

  @ApiProperty({
    description: "사용자 이메일 인증 여부",
    type: Date,
    format: "date-time",
    nullable: true,
  })
  @Expose()
  readonly emailVerified: Date | null;

  @ApiProperty({
    description: "사용자 이미지",
    type: "string",
    nullable: true,
  })
  @Expose()
  readonly image: string | null;

  @ApiProperty({
    description: "사용자 마지막 활동 시간",
    type: Date,
    nullable: true,
    format: "date-time",
  })
  @Expose()
  readonly lastActiveAt: Date | null;

  @ApiProperty({
    description: "사용자 계정 정지 여부",
    type: Boolean,
    required: true,
  })
  @Expose()
  readonly isSuspended: boolean;

  @ApiProperty({
    description: "사용자 삭제 시간",
    type: Date,
    nullable: true,
    format: "date-time",
  })
  @Expose()
  readonly deletedAt: Date | null;

  @ApiProperty({
    description: "사용자 프로필",
    type: UserProfileDto,
    required: true,
  })
  @Expose()
  readonly UserProfile: UserProfileDto;

  @ApiProperty({
    description: "사용자 설정",
    type: UserSettingsDto,
    required: true,
  })
  @Expose()
  readonly UserSettings: UserSettingsDto;
}
