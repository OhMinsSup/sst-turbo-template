import { ThrottlerException } from "@nestjs/throttler";

import { HttpResultCode } from "@template/common";

import { ErrorResponseOption } from "../../decorators/error-response.decorator";

export const GlobalThrottlerErrorCode = "Global-0000";

type Keys = typeof GlobalThrottlerErrorCode;

export const GlobalErrorDefine: Record<Keys, ErrorResponseOption> = {
  // 스로틀
  [GlobalThrottlerErrorCode]: {
    model: ThrottlerException,
    exampleDescription: "과도한 요청을 보낼시에 발생하는 에러",
    exampleTitle: "과도한 요청",
    message: "ThrottlerException: Too Many Requests",
    resultCode: HttpResultCode.TOO_MANY_REQUESTS,
  },
};
