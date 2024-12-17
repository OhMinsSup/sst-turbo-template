import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional } from "class-validator";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";
import { ToStringBooleanArray } from "../../../libs/transform";
import { PaginationDto } from "../../../shared/dtos/models/pagination.dto";
import { SortOrder } from "../../../types/sort-order";

export enum WorkspaceSortTag {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  ORDER = "order",
}

export class ListWorkspaceDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: "작업공간 제목 검색",
    nullable: true,
  })
  @IsOptionalString()
  readonly title?: string;

  @ApiProperty({
    required: false,
    description: "정렬 기준",
    nullable: true,
    enum: WorkspaceSortTag,
  })
  @IsEnum(WorkspaceSortTag, {
    message: "정렬 기준이 잘못되었습니다.",
  })
  @IsOptional()
  readonly sortTag?: WorkspaceSortTag;

  @ApiProperty({
    required: false,
    description: "정렬 순서",
    nullable: true,
    enum: SortOrder,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;

  @ApiProperty({
    required: false,
    type: ["string"],
    description: "즐겨찾기",
    nullable: true,
    example: ["true", "false"],
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @ToStringBooleanArray()
  readonly favorites?: boolean[];
}
