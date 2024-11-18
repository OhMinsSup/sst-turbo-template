import { Injectable } from "@nestjs/common";

import { Prisma } from "@template/db";
import {
  getExternalUserSelector,
  getInternalUserSelector,
} from "@template/db/selectors";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { SessionService } from "../../../routes/auth/services/session.service";
import { TokenService } from "../../../routes/auth/services/token.service";
import { EmailUserCreateDTO } from "../dto/email-user-create.dto";

interface CreateNewUserParams extends EmailUserCreateDTO {
  salt: string;
  username: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * @description 유저 생성
   * @param {CreateNewUserParams} input
   * @param {Prisma.TransactionClient?} tx
   */
  async createNewUser(
    { email, username, password, salt }: CreateNewUserParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.create({
      data: {
        email,
        username,
        encryptedPassword: password,
        encryptedSalt: salt,
      },
    });
  }

  /**
   * @description 유저 이메일로 존재하는지 확인
   * @param {string} email
   * @param {Prisma.TransactionClient?} tx
   */
  async isDuplicatedEmail(
    email: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  /**
   * @description 암호화된 비밀번호와 Salt, ID를 반환합니다.
   * @param {string} email
   * @param {Prisma.TransactionClient?} tx
   */
  async isDuplicatedEmailWithEncryptedPassword(
    email: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { email },
      select: {
        id: true,
        encryptedPassword: true,
        encryptedSalt: true,
        email: true,
      },
    });
  }

  /**
   * @description Get a user by id (external)
   * @param {string} id
   * @param {Prisma.TransactionClient?} tx
   */
  async findUserByIdExternal(
    id: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { id, deletedAt: null },
      select: getExternalUserSelector(),
    });
  }

  /**
   * @description Get a user by email (external)
   * @param {string} email
   * @param {Prisma.TransactionClient?} tx
   */
  async findUserByEmailExternal(email: string, tx?: Prisma.TransactionClient) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { email, deletedAt: null },
      select: getExternalUserSelector(),
    });
  }

  /**
   * @description Get a user by id (internal)
   * @param {string} id
   * @param {Prisma.TransactionClient?} tx
   */
  async findUserByIdInternal(
    id: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { id, deletedAt: null },
      select: getInternalUserSelector(),
    });
  }

  /**
   * @description Get a user by email (internal)
   * @param {string} email
   * @param {Prisma.TransactionClient?} tx
   */
  async findUserByEmailInternal(email: string, tx?: Prisma.TransactionClient) {
    const ctx = tx ? tx.user : this.prisma.user;
    return await ctx.findUnique({
      where: { email, deletedAt: null },
      select: getInternalUserSelector(),
    });
  }

  /**
   * @description 유저 이름 생성
   * @param {string?} username
   * @returns {string}
   */
  makeRandomUsername(username?: string): string {
    if (username) {
      return username;
    }

    const makeRandomString = (length: number) => {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    };

    return "user_" + makeRandomString(10);
  }

  /**
   * @description 유저의 마지막 로그인 시간을 업데이트합니다.
   * @param {string} userId
   * @param {Prisma.TransactionClient?} tx
   */
  updateLastSignInAt(
    userId: string,
    tx?: Prisma.TransactionClient | undefined,
  ) {
    const ctx = tx ? tx.user : this.prisma.user;
    return ctx.update({
      where: { id: userId },
      data: { lastSignInAt: new Date() },
    });
  }

  /**
   * @description Refresh Token을 이용하여 사용자 또는 세션을 로드합니다.
   * @param {string} token
   * @param {Prisma.TransactionClient?} tx
   */
  async findUserWithRefreshToken(
    token: string,
    tx?: Prisma.TransactionClient | undefined,
  ) {
    const tokenData = await this.tokenService.findRefreshTokenByToken(
      token,
      tx,
    );

    if (!tokenData) {
      return null;
    }

    const userData = await this.findUserByIdExternal(tokenData.userId, tx);
    if (!userData) {
      return null;
    }

    const sessionData = await this.sessionService.findSessionByID(
      tokenData.sessionId,
      tx,
    );
    if (!sessionData) {
      return null;
    }

    return {
      user: userData,
      session: sessionData,
      refreshToken: tokenData,
    };
  }
}
