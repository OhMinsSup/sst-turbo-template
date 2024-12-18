import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { WidgetsController } from "./controllers/widgets.controller";
import { WidgetsService } from "./services/widgets.service";

@Module({
  controllers: [WidgetsController],
  providers: [WidgetsService],
  imports: [forwardRef(() => AuthModule)],
})
export class WidgetsModule {}
