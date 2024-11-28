import { ApiProperty } from "@nestjs/swagger";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";
import { PaginationDto } from "../../../shared/dtos/models/pagination.dto";

export class ListWorkspaceDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: "작업공간 제목 검색",
    nullable: true,
  })
  @IsOptionalString()
  readonly title?: string;
}
