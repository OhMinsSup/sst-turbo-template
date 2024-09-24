import { Injectable } from "@nestjs/common";

import { UserExternalPayload } from "@template/db/selectors";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { UsersService } from "../../../routes/users/services/users.service";
import { CreatePostDTO } from "../dto/create-post.dto";

@Injectable()
export class PostsService {
  private _contextName = "posts - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly user: UsersService,
  ) {}

  /**
   * @description Create Post Handler
   * @param {UserExternalPayload} user
   * @param {CreatePostDTO} input
   */
  async create(user: UserExternalPayload, input: CreatePostDTO) {
    return this.prisma.$transaction(async (tx) => {});
  }
}
