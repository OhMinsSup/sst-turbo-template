import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Expose, Type } from "class-transformer";

import { UserEntity } from "../../../../routes/users/entities/user.entity";

export class UserResponseDto {
  @ApiProperty({ enum: HttpStatus, description: "상태코드" })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({
    enum: HttpResultCodeEnum,
    description: "결과 코드",
  })
  @Expose()
  readonly resultCode: number;

  @ApiProperty({
    type: () => UserEntity,
    description: "데이터 응답",
  })
  @Type(() => UserEntity)
  @Expose()
  readonly data: UserEntity;
}
