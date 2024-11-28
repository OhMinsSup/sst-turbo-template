import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { CustomValidationError } from "./validation-exception-response.dto";

@Exclude()
export class ValidationErrorDto {
  @ApiProperty({
    description: "상태코드",
  })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: number;

  @ApiProperty({
    type: () => CustomValidationError,
    description: "Custom Validation Error Response DTO",
  })
  @Type(() => CustomValidationError)
  @Expose()
  readonly error: CustomValidationError;
}
