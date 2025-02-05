import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Exclude, Expose, Type } from "class-transformer";

import { ValidationExceptionResponseDto } from "./validation-exception-response.dto";

@Exclude()
export class ValidationErrorDto {
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
    type: () => ValidationExceptionResponseDto,
    description: "Custom Validation Error Response DTO",
  })
  @Type(() => ValidationExceptionResponseDto)
  @Expose()
  readonly error: ValidationExceptionResponseDto;
}
