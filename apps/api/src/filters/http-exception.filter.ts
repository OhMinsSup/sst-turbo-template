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

import { ErrorResponseDto } from "../shared/dtos/response/error-response.dto";
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
    let error: HttpExceptionResponseDto;

    // 많은 요청이 들어왔을 때
    if (exception instanceof ThrottlerException) {
      statusCode = HttpStatus.TOO_MANY_REQUESTS;
      error = {
        resultCode: GlobalErrorDefine[GlobalThrottlerErrorCode].resultCode,
        message: GlobalErrorDefine[GlobalThrottlerErrorCode].message as string,
        error: ThrottlerException.name,
      };
    } else if (exception instanceof CustomValidationError) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      const objError = getError as HttpExceptionResponseDto;
      error = {
        ...objError,
      };
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      if (typeof getError === "string") {
        error = {
          resultCode: HttpResultCode.FAIL,
          error: exception.name,
          message: getError,
        };
      } else {
        // 에러 코드화를 진행할 부분
        const objError = getError as HttpExceptionResponseDto;
        error = {
          resultCode: objError.resultCode ?? HttpResultCode.FAIL,
          message: objError.message,
          error: exception.name,
        };
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        statusCode,
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        error: {
          resultCode: HttpResultCode.FAIL,
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

    const errorResponse: ErrorResponseDto<HttpExceptionResponseDto> = {
      statusCode: statusCode,
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      error: error,
    };

    Logger.warn("errorResponse", JSON.stringify(errorResponse));

    return response.status(statusCode).json(errorResponse);
  }
}
