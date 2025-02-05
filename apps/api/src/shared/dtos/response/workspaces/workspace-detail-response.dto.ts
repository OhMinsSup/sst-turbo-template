import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Expose, Type } from "class-transformer";

import { WorkspaceEntity } from "../../../../routes/workspaces/entities/workspace.entity";

export class WorkspaceDetailResponseDto {
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
    type: () => WorkspaceEntity,
    description: "데이터 응답",
  })
  @Type(() => WorkspaceEntity)
  @Expose()
  readonly data: WorkspaceEntity;
}
