import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserProfileEntity {
  @ApiProperty({
    title: "이미지",
    description: "프로필 이미지",
  })
  @Expose()
  readonly image: string;
}
