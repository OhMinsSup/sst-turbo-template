import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { EnumToArray } from "../../enumNumberToArray";

export class SuccessResponseDto<Result, Message> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: "상태코드" })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({
    enum: EnumToArray(HttpResultCode),
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: number;

  @ApiProperty({ type: Boolean, description: "성공여부" })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    type: "generic",
    nullable: true,
    description: "object 또는 array 형식 또는 프리미티 형식.",
  })
  @Expose()
  data: Result;
}
