import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { EnumToArray } from "../../enumNumberToArray";
import { HttpErrorNameEnum } from "../../httpErrorNameEnum";

export class HttpExceptionResponseDto {
  @ApiProperty({
    enum: HttpErrorNameEnum,
    description: "에러명",
  })
  @Expose()
  error: string;

  @ApiProperty({
    type: String,
    description: "에러메시지",
  })
  @Expose()
  message: string;

  @ApiProperty({
    enum: EnumToArray(HttpResultCode),
    description: "에러 코드",
  })
  @Expose()
  resultCode: number;

  constructor(error: string, message: string, resultCode: number) {
    this.error = error;
    this.message = message;
    this.resultCode = resultCode;
  }
}
