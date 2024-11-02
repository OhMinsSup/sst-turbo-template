import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;

    return next
      .handle()
      .pipe(
        map((data) => ({ statusCode, resultCode: data.code, data: data.data })),
      );
  }
}
