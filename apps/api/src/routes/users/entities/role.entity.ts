import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RoleEntity {
  @ApiProperty({
    title: "기호",
    description: "역할 기호",
    example: "USER",
    required: true,
  })
  @Expose()
  readonly symbol: string;
}
