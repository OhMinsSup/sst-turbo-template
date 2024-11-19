import { Injectable } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { ErrorResponseOption } from "src/decorators/error-response.decorator";

import { HttpResultCode } from "@template/common";

export const GlobalErrorDefine = {
  throttler: {
    model: ThrottlerException,
    exampleDescription: "과도한 요청을 보낼시에 발생하는 에러",
    exampleTitle: "과도한 요청",
    message: "ThrottlerException: Too Many Requests",
    resultCode: HttpResultCode.TOO_MANY_REQUESTS,
  },
};

@Injectable()
export class GlobalErrorService {
  /**
   * @description 과도한 요청
   * @returns {ErrorResponseOption}
   */
  throttler(): ErrorResponseOption {
    return GlobalErrorDefine.throttler;
  }
}
