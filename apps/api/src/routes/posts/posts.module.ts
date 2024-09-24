import { Module } from "@nestjs/common";

import { PostsController } from "./controllers/posts.controller";
import { PostsService } from "./services/posts.service";

@Module({
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
