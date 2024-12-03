import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

import { HttpResultCode } from "@template/common";

import { WorkspaceEntity } from "../../../../routes/workspaces/entities/workspace.entity";
import { PageInfoDto } from "../../models/list.dto";

export class WorkspacePaginationListDto {
  @IsNumber()
  @ApiProperty({
    type: "number",
    description: "전체 데이터 수",
  })
  @Expose()
  readonly totalCount: number;

  @IsArray()
  @ApiProperty({
    type: () => WorkspaceEntity,
    isArray: true,
    description: "데이터 목록",
  })
  @Type(() => WorkspaceEntity)
  @Expose()
  readonly list: WorkspaceEntity[];

  @ApiProperty({
    type: () => PageInfoDto,
    description: "페이지 정보",
  })
  @Type(() => PageInfoDto)
  @Expose()
  readonly pageInfo: PageInfoDto;
}

export class WorkspaceListResponseDto {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({
    enum: HttpResultCode,
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: number;

  @ApiProperty({
    type: () => WorkspacePaginationListDto,
    description: "데이터 응답",
  })
  @Type(() => WorkspacePaginationListDto)
  @Expose()
  readonly data: WorkspacePaginationListDto;
}
