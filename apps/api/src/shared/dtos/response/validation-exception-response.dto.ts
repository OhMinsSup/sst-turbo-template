import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { HttpResultCode } from "@template/common";

import { EnumToArray } from "../../enumNumberToArray";

export class ValidationExceptionResponseDto {
  @ApiProperty({
    type: String,
    description: "에러명",
    example: "ValidationError",
  })
  @Expose()
  error = "ValidationError";

  @ApiProperty({
    type: String,
    description: "에러메시지",
    example: "검증오류",
  })
  @Expose()
  message = "검증오류";

  @ApiProperty({
    type: Number,
    description: "400 검증오류 고정",
    example: HttpStatus.BAD_REQUEST,
  })
  @Expose()
  statusCode = HttpStatus.BAD_REQUEST;

  @ApiProperty({
    enum: EnumToArray(HttpResultCode),
    description: "에러 코드",
    default: HttpResultCode.INVALID_REQUEST,
  })
  @Expose()
  resultCode = HttpResultCode.INVALID_REQUEST;

  @ApiProperty({
    description: "필드 : [에러정보] 형식의 에러정보가 담긴 객체입니다.",
    example: { fieldName: ["errorinfoOfString"] },
  })
  @Expose()
  validationErrorInfo: Record<string, Array<string>>;

  constructor(validationErrorInfo: Record<string, Array<string>>) {
    this.validationErrorInfo = validationErrorInfo;
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
        resultCode: HttpResultCode.FAIL,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
