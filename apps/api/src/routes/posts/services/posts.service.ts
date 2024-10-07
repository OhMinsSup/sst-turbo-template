import { Injectable } from "@nestjs/common";

import type { UserExternalPayload } from "@template/db/selectors";
import { getPostSelector } from "@template/db/selectors";
import { HttpResultStatus } from "@template/sdk";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { NotificationsService } from "../../../routes/notifications/services/notifications.service";
import { UsersService } from "../../../routes/users/services/users.service";
import { CreatePostDTO } from "../dto/create-post.dto";
import { PostListDTO } from "../dto/post-list.dto";

@Injectable()
export class PostsService {
  private _contextName = "posts - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly user: UsersService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * @description Create Post Handler
   * @param {UserExternalPayload} user
   * @param {CreatePostDTO} input
   */
  async create(user: UserExternalPayload, input: CreatePostDTO) {
    const txResult = await this.prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          text: input.text,
          authorId: user.id,
        },
        select: {
          id: true,
        },
      });

      return newPost;
    });

    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: {
        dataId: txResult.id,
      },
    };
  }

  /**
   * @description Get Infinite Post Handler
   * @param {PostListDTO} input
   * @param {UserExternalPayload?} user
   */

  async getInfinitePost(input: PostListDTO, user?: UserExternalPayload) {
    const limit = input.limit ?? 20;

    const pageNo = input.pageNo ?? 1;

    const [totalCount, list] = await Promise.all([
      this.prisma.post.count({
        where: {
          ...(input.keyword && {
            text: {
              contains: input.keyword,
            },
          }),
        },
      }),
      this.prisma.post.findMany({
        where: {
          ...(input.keyword && {
            text: {
              contains: input.keyword,
            },
          }),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (pageNo - 1) * limit,
        take: limit,
        select: getPostSelector(),
      }),
    ]);

    const hasNextPage = totalCount > pageNo * limit;

    return {
      resultCode: HttpResultStatus.OK,
      message: null,
      error: null,
      result: {
        totalCount,
        list,
        pageInfo: {
          currentPage: pageNo,
          hasNextPage,
          nextPage: hasNextPage ? pageNo + 1 : null,
        },
      },
    };
  }
}
