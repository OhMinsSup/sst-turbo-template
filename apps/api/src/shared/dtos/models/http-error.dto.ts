import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { HttpExceptionResponseDto } from "./http-exception-response.dto";

@Exclude()
export class HttpErrorDto {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  readonly statusCode: HttpStatus;

  @ApiProperty({
    enum: HttpResultCode,
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: HttpResultCode;

  @ApiProperty({
    type: () => HttpExceptionResponseDto,
    description: "Http Exception Response DTO",
  })
  @Type(() => HttpExceptionResponseDto)
  @Expose()
  readonly error: HttpExceptionResponseDto;
}
