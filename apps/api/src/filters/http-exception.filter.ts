import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Request, Response } from "express";

import { HttpResultCode } from "@template/common";

import { HttpExceptionResponseDto } from "../shared/dtos/response/http-exception-response.dto";
import { CustomValidationError } from "../shared/dtos/response/validation-exception-response.dto";
import { GlobalErrorDefine, GlobalThrottlerErrorCode } from "../shared/errors";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let resultCode: HttpResultCode;
    let error: HttpExceptionResponseDto;

    // 많은 요청이 들어왔을 때
    if (exception instanceof ThrottlerException) {
      statusCode = HttpStatus.TOO_MANY_REQUESTS;
      resultCode = GlobalErrorDefine[GlobalThrottlerErrorCode].resultCode;
      error = {
        message: GlobalErrorDefine[GlobalThrottlerErrorCode].message as string,
        error: ThrottlerException.name,
      };
    } else if (exception instanceof CustomValidationError) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      const objError = getError as HttpExceptionResponseDto;
      resultCode = HttpResultCode.INVALID_REQUEST;
      error = Object.assign({}, objError);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      if (typeof getError === "string") {
        resultCode = HttpResultCode.FAIL;
        error = {
          error: exception.name,
          message: getError,
        };
      } else {
        // 에러 코드화를 진행할 부분
        const objError = getError as HttpExceptionResponseDto;
        resultCode = HttpResultCode.FAIL;
        error = {
          message: objError.message,
          error: exception.name,
        };
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        statusCode,
        resultCode: HttpResultCode.FAIL,
        error: {
          error: "Internal server error",
          message: "서버에러 관리자한테 문의 주세요",
        },
      };
      Logger.error(
        "ExceptionsFilter",
        exception.stack,
        request.method + request.url,
      );

      return response.status(statusCode).json(errorResponse);
    }

    const errorResponse = {
      statusCode,
      resultCode,
      error: error,
    };

    Logger.warn("errorResponse", JSON.stringify(errorResponse));

    return response.status(statusCode).json(errorResponse);
  }
}
