import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

export class WorkspaceDeleteResponseDto {
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
    type: Boolean,
    description: "데이터 응답",
  })
  @Expose()
  readonly data: boolean;
}
