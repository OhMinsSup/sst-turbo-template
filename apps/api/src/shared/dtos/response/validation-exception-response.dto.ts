import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpErrorNameEnum } from "@template/common";

export class ValidationExceptionResponseDto {
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

  @ApiProperty({
    description: "필드 : [에러정보] 형식의 에러정보가 담긴 객체입니다.",
    example: { fieldName: ["errorinfoOfString"] },
  })
  @Expose()
  validationErrorInfo: Record<string, Array<string>>;

  constructor(validationErrorInfo: Record<string, Array<string>>) {
    this.validationErrorInfo = validationErrorInfo;
    this.error = "ValidationError";
    this.message = "검증 오류";
  }
}

export class CustomValidationError extends HttpException {
  name = "ValidationError";
  constructor(valdationErrorArray: ValidationError[]) {
    const objectsOfError = valdationErrorArray
      .map((error: ValidationError) => {
        const constrains = error.constraints;
        if (!constrains) return null;

        const constrainsErrorStrings = Object.keys(constrains).map(
          (key) => constrains[key],
        );
        return { [error.property]: constrainsErrorStrings };
      })
      .filter((e) => e)
      .reduce(function (result, item) {
        // 중복값 없다고 가정 object 머지
        if (!item) return result;
        if (!result) return result;
        Object.assign(result, item);
        return result;
      }, {}); // null 값 있을경우 필터링
    super(
      {
        error: "ValidationError",
        message: "검증 오류",
        validationErrorInfo: objectsOfError,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
