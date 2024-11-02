import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

export class ErrorResponseDto<T> {
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
    description:
      "HttpExceptionResponseDto,ValidationExceptionResponseDto 두가지가 올수있습니다.",
  })
  @Expose()
  error: T;
}
