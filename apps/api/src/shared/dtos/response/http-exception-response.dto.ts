import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpErrorNameEnum } from "@template/common";

export class HttpExceptionResponseDto {
  @ApiProperty({
    enum: HttpErrorNameEnum,
    description: "에러명",
  })
  @Expose()
  error: string;

  @ApiProperty({
    type: "string",
    description: "에러메시지",
  })
  @Expose()
  message: string;

  constructor(error: string, message: string) {
    this.error = error;
    this.message = message;
  }
}
