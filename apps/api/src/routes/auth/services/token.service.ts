import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import type { Prisma, RefreshToken } from "@template/db";
import { TokenType } from "@template/common";

import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { generateSecureToken } from "../../../libs/hash";
import { SessionService } from "./session.service";

interface CreateRefreshTokenParams {
  userId: string;
  ip?: string;
  userAgent?: string;
  oldToken?: Pick<
    RefreshToken,
    "id" | "revoked" | "sessionId" | "token" | "userId"
  >;
}

interface GenerateAccessTokenParams {
  userId: string;
  sessionId: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly env: EnvironmentService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * @description refresh token을 발급합니다.
   * @param {CreateRefreshTokenParams} params
   * @param {Prisma.TransactionClient?} tx
   */
  async issueRefreshToken(
    params: CreateRefreshTokenParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const refreshToken = await this.createRefreshToken(params, tx);

    const { token, expiresAt, session } = await this.generateAccessToken(
      {
        sessionId: refreshToken.sessionId,
        userId: refreshToken.userId,
      },
      tx,
    );

    return {
      token,
      tokenType: TokenType.Bearer,
      expiresIn: this.env.getJwtExpiresIn(),
      expiresAt: expiresAt,
      refreshToken: refreshToken.token,
      user: session.User,
    };
  }

  /**
   * @description refresh token을 재발급 합니다.
   * @param {Prisma.TransactionClient?} tx
   */
  async createRefreshToken(
    { userId, ip, userAgent, oldToken }: CreateRefreshTokenParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const token = {
      userId,
      token: generateSecureToken(),
      parent: undefined,
      sessionId: undefined,
    };

    if (oldToken) {
      token.parent = oldToken.token;
      token.sessionId = oldToken.sessionId;
    }

    if (!token.sessionId) {
      const session = await this.sessionService.createNewSession(
        { userId, ip, userAgent },
        tx,
      );
      token.sessionId = session.id;
    }

    const ctx = tx ? tx.refreshToken : this.prismaService.refreshToken;
    return await ctx.create({ data: token });
  }

  /**
   * @description access token을 발급합니다.
   * @param {GenerateAccessTokenParams} param
   * @param {Prisma.TransactionClient?} tx
   */
  async generateAccessToken(
    { userId, sessionId }: GenerateAccessTokenParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const session = await this.sessionService.findSessionByID(sessionId, tx);
    if (!session) {
      throw new Error("Session not found");
    }

    const issuedAt = new Date();
    const expiresAt = this.env.getJwtExpiresAt(issuedAt);

    const jwtOptions: JwtSignOptions = {
      subject: userId,
      expiresIn: expiresAt.getTime(),
    };

    const {
      email,
      Role: { symbol },
    } = session.User;

    const token = await this.jwtService.signAsync(
      {
        email,
        role: symbol,
        sessionId,
      },
      jwtOptions,
    );

    return {
      token,
      expiresAt,
      session,
    };
  }

  /**
   * @description refresh token을 조회합니다.
   * @param {string} token
   * @param {Prisma.TransactionClient} tx
   */
  findRefreshTokenByToken(token: string, tx: Prisma.TransactionClient) {
    const ctx = tx.refreshToken;
    return ctx.findFirst({ where: { token } });
  }
}
