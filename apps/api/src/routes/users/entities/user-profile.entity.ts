import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserProfileEntity {
  @ApiProperty({
    title: "이미지",
    description: "프로필 이미지",
    type: "string",
  })
  @Expose()
  readonly image: string;

  @ApiProperty({
    title: "이름",
    description: "이름",
    type: "string",
  })
  @Expose()
  readonly firstName: string;

  @ApiProperty({
    title: "성",
    description: "성",
    type: "string",
  })
  @Expose()
  readonly lastName: string;
}
