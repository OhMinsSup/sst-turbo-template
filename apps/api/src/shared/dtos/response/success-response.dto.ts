import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

export class SuccessResponseDto<T> {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  statusCode: number;

  @ApiProperty({
    enum: HttpResultCode,
    description: "결과 코드",
  })
  @Expose()
  resultCode: number;

  @ApiProperty({
    type: "generic",
    description: "object 또는 array 형식 또는 프리미티 형식.",
  })
  @Expose()
  data: T;
}
