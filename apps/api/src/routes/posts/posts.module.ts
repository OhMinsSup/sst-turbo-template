import { Module } from "@nestjs/common";

import { NotificationsService } from "../notifications/services/notifications.service";
import { UsersService } from "../users/services/users.service";
import { PostsController } from "./controllers/posts.controller";
import { PostsService } from "./services/posts.service";

@Module({
  providers: [PostsService, UsersService, NotificationsService],
  controllers: [PostsController],
})
export class PostsModule {}
