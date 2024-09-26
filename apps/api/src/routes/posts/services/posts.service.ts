import { Injectable } from "@nestjs/common";

import { UserExternalPayload } from "@template/db/selectors";
import { HttpResultStatus } from "@template/sdk";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { NotificationsService } from "../../../routes/notifications/services/notifications.service";
import { UsersService } from "../../../routes/users/services/users.service";
import { CreatePostDTO } from "../dto/create-post.dto";

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
}
