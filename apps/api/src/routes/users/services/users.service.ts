import { Injectable, NotFoundException } from "@nestjs/common";
import { UserExternalResponseDto } from "src/shared/dtos/response/users/user-response.dto";

import { HttpResultCode } from "@template/common";
import { Prisma } from "@template/db";
import {
  getExternalUserSelector,
  getInternalUserSelector,
  UserExternalPayload,
} from "@template/db/selectors";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { EmailUserCreateDTO } from "../dto/email-user-create.dto";

@Injectable()
export class UsersService {
  private _contextName = "users - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * @description Get the current user
   * @param {UserExternalPayload} user
   */
  async me(user: UserExternalPayload): Promise<{
    code: HttpResultCode;
    data: UserExternalPayload;
  }> {
    return {
      code: HttpResultCode.OK,
      data: user,
    };
  }

  /**
   * @description Get a user by id
   * @param {string} id
   */
  async byUserId(id: string): Promise<{
    code: HttpResultCode;
    data: UserExternalResponseDto;
  }> {
    const data = await this.getExternalUserById(id);
    if (!data) {
      throw new NotFoundException("User not found");
    }

    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  /**
   * @description Create a user
   * @param {EmailUserCreateDTO} input
   * @param {Prisma.TransactionClient?} tx
   */
  async createUser(
    input: EmailUserCreateDTO & { salt: string },
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const user = tx ? tx.user : this.prisma.user;
    return await user.create({
      data: {
        email: input.email,
        name: input.name,
        image: input.image,
        lastActiveAt: new Date(),
        Password: {
          create: {
            hash: input.password,
            salt: input.salt,
          },
        },
        UserProfile: {
          create: {},
        },
        UserSettings: {
          create: {},
        },
      },
    });
  }

  /**
   * @description Check if a user exists by id
   * @param {string} id
   */
  async checkUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  /**
   * @description Check if a user exists by email
   * @param {string} email
   */
  async checkUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  /**
   * @description Get a user by id (simple)
   * @param {string} id
   */
  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        image: true,
      },
    });
  }

  /**
   * @description Get a user by id (external)
   * @param {string} id
   */
  async getExternalUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: getExternalUserSelector(),
    });
  }

  /**
   * @description Get a user by id (internal)
   * @param {string} id
   */
  async getInternalUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: getInternalUserSelector(),
    });
  }

  /**
   * @description Get a user by email (internal)
   * @param {string} email
   */
  async getInternalUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: getInternalUserSelector(),
    });
  }
}
