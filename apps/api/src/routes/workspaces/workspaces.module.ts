import { Module } from "@nestjs/common";

import { WorkspacesController } from "./controllers/workspaces.controller";
import { WorkspacesService } from "./services/workspaces.service";

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
