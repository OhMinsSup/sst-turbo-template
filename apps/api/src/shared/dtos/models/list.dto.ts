import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";

@Exclude()
export class PageInfoDto {
  @IsNumber()
  @ApiProperty({
    type: "number",
    description: "현재 페이지",
    nullable: false,
  })
  @Expose()
  readonly currentPage: number;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: "다음 페이지 존재 여부",
    nullable: false,
  })
  @Expose()
  readonly hasNextPage: boolean;

  @IsNumber()
  @ApiProperty({
    type: "number",
    description: "다음 페이지 번호",
    nullable: true,
  })
  readonly nextPage: number | null;
}
