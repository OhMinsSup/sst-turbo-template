import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

import type { UserExternalPayload } from "@template/db/selectors";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { JwtAuth } from "../../../guards/jwt.auth.guard";
import { OptionalJwtAuth } from "../../../guards/optional-jwt.auth.guard";
import { CreatePostDTO } from "../dto/create-post.dto";
import { PostListDTO } from "../dto/post-list.dto";
import { PostsService } from "../services/posts.service";

@ApiTags("게시글")
@Controller("posts")
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  @ApiOperation({ summary: "게시글 목록" })
  @ApiQuery({
    required: false,
    description: "검색 파라미터",
    type: PostListDTO,
  })
  @OptionalJwtAuth()
  async getInfinitePost(
    @Query() query: PostListDTO,
    @AuthUser() user?: UserExternalPayload,
  ) {
    return await this.service.getInfinitePost(query, user);
  }

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
