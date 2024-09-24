import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { JwtAuth } from "src/guards/jwt.auth.guard";

import type { UserExternalPayload } from "@template/db/selectors";

import { CreatePostDTO } from "../dto/create-post.dto";
import { PostsService } from "../services/posts.service";

@ApiTags("게시글")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post()
  @ApiOperation({ summary: "게시글 작성" })
  @ApiBody({
    required: true,
    description: "게시글 작성 API",
    type: CreatePostDTO,
  })
  @JwtAuth()
  async create(
    @AuthUser() user: UserExternalPayload,
    @Body() body: CreatePostDTO,
  ) {
    return await this.service.create(user, body);
  }
}
