import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";
import { PaginationDto } from "../../../shared/dtos/models/pagination.dto";

export enum WorkspaceOrderByEnum {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export class ListWorkspaceDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: "작업공간 제목 검색",
    nullable: true,
  })
  @IsOptionalString()
  readonly title?: string;

  @IsEnum(WorkspaceOrderByEnum, {
    message: "정렬 기준이 잘못되었습니다.",
  })
  @ApiProperty({
    required: false,
    description: "정렬 기준",
    nullable: true,
    enum: WorkspaceOrderByEnum,
    example: WorkspaceOrderByEnum.CREATED_AT,
  })
  readonly orderBy?: WorkspaceOrderByEnum;
}
