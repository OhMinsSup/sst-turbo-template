import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber } from "class-validator";

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

export class ListDto<T> {
  @IsNumber()
  @ApiProperty({
    type: "number",
    description: "전체 데이터 수",
    nullable: false,
  })
  @Expose()
  readonly totalCount: number;

  @IsArray()
  @ApiProperty({
    type: "generic",
    isArray: true,
    description: "데이터 목록",
    nullable: false,
  })
  @Expose()
  readonly list: T[];

  @ApiProperty({
    type: () => PageInfoDto,
    description: "페이지 정보",
    nullable: false,
  })
  @Type(() => PageInfoDto)
  @Expose()
  readonly pageInfo: PageInfoDto;
}
