import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class FavoriteWorkspaceDto {
  @ApiProperty({
    required: true,
    description: "즐겨찾기 여부",
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  readonly isFavorite: boolean;
}
