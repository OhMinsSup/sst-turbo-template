import { ApiProperty } from "@nestjs/swagger";

import { UserProfile, UserSettings } from "@template/db";
import { UserExternalPayload } from "@template/db/selectors";

class UserProfileDto implements Pick<UserProfile, "bio" | "website"> {
  @ApiProperty({
    description: "사용자 자기 소개",
  })
  readonly bio: string;

  @ApiProperty({
    description: "사용자 웹사이트",
  })
  readonly website: string;
}

class UserSettingsDto implements Pick<UserSettings, "privacySettings"> {
  @ApiProperty({
    description: "사용자 개인 정보 설정",
  })
  readonly privacySettings: boolean;
}

export class UserExternalResponseDto implements UserExternalPayload {
  @ApiProperty({
    description: "사용자 아이디",
  })
  readonly id: string;

  @ApiProperty({
    description: "사용자 이름",
  })
  readonly name: string;

  @ApiProperty({
    description: "사용자 이메일",
  })
  readonly email: string;

  @ApiProperty({
    description: "사용자 이메일 인증 여부",
  })
  readonly emailVerified: Date;

  @ApiProperty({
    description: "사용자 이미지",
  })
  readonly image: string;

  @ApiProperty({
    description: "사용자 마지막 활동 시간",
  })
  readonly lastActiveAt: Date;

  @ApiProperty({
    description: "사용자 계정 정지 여부",
  })
  readonly isSuspended: boolean;

  @ApiProperty({
    description: "사용자 삭제 시간",
  })
  readonly deletedAt: Date;

  @ApiProperty({
    description: "사용자 프로필",
    type: UserProfileDto,
  })
  readonly UserProfile: UserProfileDto;

  @ApiProperty({
    description: "사용자 설정",
    type: UserSettingsDto,
  })
  readonly UserSettings: UserSettingsDto;
}
