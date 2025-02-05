import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { HttpResultCodeEnum } from "@veloss/constants/http";
import { Request, Response } from "express";

import { HttpExceptionResponseDto } from "../shared/dtos/models/http-exception-response.dto";
import { CustomValidationError } from "../shared/dtos/models/validation-exception-response.dto";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let resultCode: HttpResultCodeEnum;
    let error: HttpExceptionResponseDto;

    // 많은 요청이 들어왔을 때
    if (exception instanceof ThrottlerException) {
      statusCode = HttpStatus.TOO_MANY_REQUESTS;
      const throttler = {
        message: "ThrottlerException: Too Many Requests",
      };
      resultCode = HttpResultCodeEnum.TOO_MANY_REQUESTS;
      error = {
        message: throttler.message,
        error: ThrottlerException.name,
      };
    } else if (exception instanceof CustomValidationError) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      const objError = getError as HttpExceptionResponseDto;
      resultCode = HttpResultCodeEnum.INVALID_REQUEST;
      error = Object.assign({}, objError);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const getError = exception.getResponse();
      if (typeof getError === "string") {
        resultCode = HttpResultCodeEnum.FAIL;
        error = {
          error: exception.name,
          message: getError,
        };
      } else {
        // 에러 코드화를 진행할 부분
        const objError = getError as Record<string, string | number>;
        resultCode = objError.resultCode as unknown as HttpResultCodeEnum;
        error = {
          error: exception.name,
          message: objError.message as string,
        };
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        statusCode,
        resultCode: HttpResultCodeEnum.FAIL,
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
      error,
    };

    Logger.warn("errorResponse", JSON.stringify(errorResponse));

    return response.status(statusCode).json(errorResponse);
  }
}
