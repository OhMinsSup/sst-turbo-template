import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { ValidationExceptionResponseDto } from "./validation-exception-response.dto";

@Exclude()
export class ValidationErrorDto {
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
    type: () => ValidationExceptionResponseDto,
    description: "Custom Validation Error Response DTO",
  })
  @Type(() => ValidationExceptionResponseDto)
  @Expose()
  readonly error: ValidationExceptionResponseDto;
}
