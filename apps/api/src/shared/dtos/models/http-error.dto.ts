import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Exclude, Expose, Type } from "class-transformer";

import { HttpExceptionResponseDto } from "./http-exception-response.dto";

@Exclude()
export class HttpErrorDto {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  readonly statusCode: HttpStatus;

  @ApiProperty({
    enum: HttpResultCodeEnum,
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: HttpResultCodeEnum;

  @ApiProperty({
    type: () => HttpExceptionResponseDto,
    description: "Http Exception Response DTO",
  })
  @Type(() => HttpExceptionResponseDto)
  @Expose()
  readonly error: HttpExceptionResponseDto;
}
