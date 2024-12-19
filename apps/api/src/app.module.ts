import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { IntegrationsModule } from "./integrations/integrations.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { AuthModule } from "./routes/auth/auth.module";
import { TablesModule } from "./routes/tables/tables.module";
import { UsersModule } from "./routes/users/users.module";
import { WorkspacesModule } from "./routes/workspaces/workspaces.module";
import { FieldsModule } from './routes/fields/fields.module';
import { RecordsModule } from './routes/records/records.module';

@Module({
  imports: [
    IntegrationsModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    TablesModule,
    FieldsModule,
    RecordsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
