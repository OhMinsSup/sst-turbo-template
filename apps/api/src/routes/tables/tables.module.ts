import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { TablesController } from "./controllers/tables.controller";
import { TablesService } from "./services/tables.service";

@Module({
  controllers: [TablesController],
  providers: [TablesService],
  imports: [forwardRef(() => AuthModule)],
})
export class TablesModule {}
