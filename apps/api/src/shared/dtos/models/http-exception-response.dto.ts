import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

import { HttpErrorNameEnum } from "@template/common";

@Exclude()
export class HttpExceptionResponseDto {
  @ApiProperty({
    enum: HttpErrorNameEnum,
    description: "에러명",
  })
  @Expose()
  readonly error: string;

  @ApiProperty({
    type: "string",
    description: "에러메시지",
  })
  @Expose()
  readonly message: string;

  constructor(error: string, message: string) {
    this.error = error;
    this.message = message;
  }
}
