import { Module } from "@nestjs/common";

import { NotificationsController } from "./controllers/notifications.controller";
import { NotificationsService } from "./services/notifications.service";

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
