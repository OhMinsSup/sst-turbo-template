import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Expose, Type } from "class-transformer";
import { IsArray } from "class-validator";

import { WorkspaceEntity } from "../../../../routes/workspaces/entities/workspace.entity";

export class WidgetWorkspaceListDto {
  @IsArray()
  @ApiProperty({
    type: () => WorkspaceEntity,
    isArray: true,
    description: "데이터 목록",
  })
  @Type(() => WorkspaceEntity)
  @Expose()
  readonly workspaces: WorkspaceEntity[];

  @IsArray()
  @ApiProperty({
    type: () => WorkspaceEntity,
    isArray: true,
    description: "데이터 목록",
  })
  @Type(() => WorkspaceEntity)
  @Expose()
  readonly favoriteWorkspaces: WorkspaceEntity[];
}

export class WidgetWorkspaceListResponseDto {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({
    enum: HttpResultCodeEnum,
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: number;

  @ApiProperty({
    type: () => WidgetWorkspaceListDto,
    description: "데이터 응답",
  })
  @Type(() => WidgetWorkspaceListDto)
  @Expose()
  readonly data: WidgetWorkspaceListDto;
}
