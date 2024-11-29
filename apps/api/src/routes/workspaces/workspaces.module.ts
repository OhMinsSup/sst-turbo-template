import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { WorkspacesController } from "./controllers/workspaces.controller";
import { WorkspacesService } from "./services/workspaces.service";

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [forwardRef(() => AuthModule)],
})
export class WorkspacesModule {}
