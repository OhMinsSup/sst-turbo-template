import type { JwtSignOptions } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

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

interface RevokeTokenFamilyParams {
  sessionId?: string;
  token?: string;
}

interface GrantRefreshTokenSwapParms
  extends Omit<CreateRefreshTokenParams, "oldToken"> {
  token: RefreshToken;
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
    const refreshToken = await this.grantAuthenticatedUser(params, tx);

    const { token, expiresAt, session, expiresIn } =
      await this.generateAccessToken(
        {
          sessionId: refreshToken.sessionId,
          userId: refreshToken.userId,
        },
        tx,
      );

    return {
      token,
      expiresAt,
      expiresIn,
      session,
      refreshToken: refreshToken.token,
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
      expiresIn: this.env.getJwtExpiresIn(),
      session,
    };
  }

  /**
   * @description refresh token을 조회합니다.
   * @param {string} token
   * @param {Prisma.TransactionClient} tx
   */
  findRefreshTokenByToken(
    token: string,
    tx: Prisma.TransactionClient = undefined,
  ) {
    const ctx = tx ? tx.refreshToken : this.prismaService.refreshToken;
    return ctx.findFirst({ where: { token } });
  }

  /**
   * @description 현재 활성화된 refresh token을 조회합니다.
   * @param {string} sessionId
   */
  findCurrentlyActiveRefreshToken(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.refreshToken : this.prismaService.refreshToken;
    return ctx.findFirst({
      where: {
        sessionId,
        revoked: false,
      },
    });
  }

  /**
   * @description refresh token을 폐기합니다.
   * @param {RevokeTokenFamilyParams} param
   * @param {Prisma.TransactionClient?} tx
   */
  async revokeTokenFamily(
    { sessionId, token }: RevokeTokenFamilyParams,
    tx: Prisma.TransactionClient = undefined,
  ) {
    const tablename = "RefreshToken";
    const ctx = tx ? tx : this.prismaService;

    if (sessionId) {
      await ctx.$executeRawUnsafe(
        `UPDATE ${tablename} SET revoked = true, updated_at = now() WHERE session_id = $1 AND revoked = false;`,
        sessionId,
      );
    } else if (token) {
      await ctx.$executeRawUnsafe(
        `
          WITH RECURSIVE token_family AS (
            SELECT id, userId, token, revoked, parent FROM ${tablename} WHERE parent = $1
            UNION
            SELECT r.id, r.userId, r.token, r.revoked, r.parent
            FROM ${tablename} r
            INNER JOIN token_family t ON t.token = r.parent
          )
          UPDATE ${tablename} r
          SET revoked = true
          FROM token_family
          WHERE token_family.id = r.id;
          `,
        token,
      );
    }
  }

  /**
   * @description refresh token을 교환합니다.
   * @param {GrantRefreshTokenSwapParms} param
   * @param {Prisma.TransactionClient?} tx
   */
  async grantRefreshTokenSwap(
    { token, userId, userAgent, ip }: GrantRefreshTokenSwapParms,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.refreshToken : this.prismaService.refreshToken;

    // 토큰을 폐기
    await ctx.update({
      where: { id: token.id },
      data: { revoked: true },
    });

    // 새로운 refresh token 생성
    return await this.createRefreshToken(
      {
        userId,
        ip,
        userAgent,
        oldToken: token,
      },
      tx,
    );
  }

  /**
   * @description 인증된 사용자에게 refresh token을 부여합니다.
   * @param {CreateRefreshTokenParams} params
   * @param {Prisma.TransactionClient?} tx
   */
  async grantAuthenticatedUser(
    params: CreateRefreshTokenParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    return await this.createRefreshToken(params, tx);
  }
}
