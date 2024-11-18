import { Module } from "@nestjs/common";

import { RoleController } from "./controllers/role.controller";
import { RoleService } from "./services/role.service";

@Module({
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
