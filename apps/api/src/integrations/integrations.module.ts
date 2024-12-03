import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";

import { EnvironmentModule } from "./environment/environment.module";
import { EnvironmentService } from "./environment/environment.service";
import { LoggerModule } from "./logger/logger.module";
import { loggerModuleFactory } from "./logger/logger.module-definition";
import { PrismaModule } from "./prisma/prisma.module";

@Global()
@Module({
  imports: [
    EnvironmentModule.forRoot({}),
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [EnvironmentService],
    }),
    ThrottlerModule.forRootAsync({
      inject: [EnvironmentService],
      // @ts-expect-error - ignoreUserAgents is not defined in ThrottlerModuleOptions
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (environmentService: EnvironmentService) => {
        const throttleConfig = environmentService.getThrottleConfig();
        return {
          ttl: throttleConfig.ttl,
          limit: throttleConfig.limit,
          ignoreUserAgents: throttleConfig.ignoreUserAgents,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (env: EnvironmentService) => ({
        secret: env.getJwtSecret(),
      }),
      inject: [EnvironmentService],
    }),
    PrismaModule,
  ],
  exports: [],
  providers: [],
})
export class IntegrationsModule {}
