import type { NestExpressApplication } from "@nestjs/platform-express";
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationError } from "class-validator";
import compression from "compression";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { SuccessInterceptor } from "./interceptors/sucess.interceptor";
import { CustomValidationError } from "./shared/dtos/response/validation-exception-response.dto";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  // 글로벌로 class 직렬화 선택
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      // transform으로 형식변환가능한지 체크 dto에 transfrom 없어도 typescript type 보고 형변환 해줌
      //  enableImplicitConversion 옵션은 타입스크립트의 타입으로 추론가능하게 설정함
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new CustomValidationError(validationErrors);
      },
    }),
  );

  app.setGlobalPrefix("api");
  app.enableVersioning({
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowedHosts = [/^https:\/\/domain.io$/];
      if (config.get("NODE_ENV") === "development") {
        allowedHosts.push(/^http:\/\/localhost/);
      }

      let corsOptions: any;
      const valid = allowedHosts.some((regex) => regex.test(origin));
      if (valid) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false }; // disable CORS for this request
      }
      callback(null, corsOptions);
    },
    credentials: true,
  });

  const swagger = new DocumentBuilder()
    .setTitle("API Document")
    .setDescription("API Document")
    .setVersion("1.0")
    .addBearerAuth({
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: "JWT token",
      name: "authorization",
      bearerFormat: "Bearer", // I`ve tested not to use this field, but the result was the same
      scheme: "Bearer",
      type: "http", // I`ve attempted type: 'apiKey' too
      in: "Header",
    })
    .addCookieAuth(config.get("ACCESS_TOKEN_NAME"))
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("api/docs", app, document, {
    jsonDocumentUrl: "/api/docs/api-json",
  });

  app.use(helmet());
  app.use(compression());

  await app.listen(config.get("SERVER_PORT"));
}
bootstrap();
