import { ApiProperty } from "@nestjs/swagger";

import { IsOptionalString } from "../../../decorators/Is-optional-string.decorator";
import { PaginationDTO } from "../../../shared/dto/pagination.dto";

export class PostListDTO extends PaginationDTO {
  @IsOptionalString()
  @ApiProperty({
    name: "keyword",
    type: "string",
    required: false,
    description: "검색어",
  })
  readonly keyword?: string;
}
