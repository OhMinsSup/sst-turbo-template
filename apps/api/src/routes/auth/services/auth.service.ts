import type { Request } from "express";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode, Provider, Role, TokenType } from "@template/common";
import { Prisma, RefreshToken, Session } from "@template/db";
import { isAfter } from "@template/utils/date";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { hash } from "../../../libs/hash";
import { UsersService } from "../../../routes/users/services/users.service";
import { SignInDTO } from "../dto/signin.dto";
import { SignUpDTO } from "../dto/signup.dto";
import { GrantType, TokenQueryDTO } from "../dto/token-query.dto";
import { TokenDTO } from "../dto/token.dto";
import { OpenApiAuthErrorDefine } from "../open-api";
import { IdentityService } from "./identity.service";
import { PasswordService } from "./password.service";
import { RoleService } from "./role.service";
import { SessionService } from "./session.service";
import { TokenService } from "./token.service";

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  sessionId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly passwordServie: PasswordService,
    private readonly roleService: RoleService,
    private readonly identityService: IdentityService,
    private readonly sessionService: SessionService,
    private readonly logger: LoggerService,
    @Inject(REQUEST) private request: Request,
  ) {}

  /**
   * @description 로그인
   * @param {SignInDTO} input
   */
  async signIn(input: SignInDTO) {
    switch (input.provider) {
      case Provider.PASSWORD: {
        return await this._signInWithPassword(input);
      }
      default: {
        throw new UnauthorizedException(
          OpenApiAuthErrorDefine.unsupportedAuthMethod,
        );
      }
    }
  }

  /**
   * @description 이메일로 로그인
   * @param {SignInDTO} input
   */
  private async _signInWithPassword(input: SignInDTO) {
    const user = await this.usersService.isDuplicatedEmail(input.email);

    if (!user) {
      throw new NotFoundException(OpenApiAuthErrorDefine.notFoundUser);
    }

    const compare = await this.passwordServie.compare(
      input.password,
      user.encryptedSalt,
      user.encryptedPassword,
    );

    if (!compare) {
      throw new BadRequestException(OpenApiAuthErrorDefine.incorrectPassword);
    }

    return await this.prismaService.$transaction(async (tx) => {
      // Identity 찾기
      const identity = await this.identityService.findIdentityByIdAndProvider(
        user.id,
        input.provider,
        tx,
      );

      if (!identity) {
        throw new NotFoundException(OpenApiAuthErrorDefine.notFoundUser);
      }

      // Refresh Token 발급
      const token = await this.tokenService.issueRefreshToken(
        {
          userId: user.id,
          ip: hash(this.request.ip),
          userAgent: this.request.headers["user-agent"],
        },
        tx,
      );

      try {
        // 마지막 로그인 시간 업데이트
        await this.usersService.updateLastSignInAt(user.id, tx);
        await this.identityService.updateLastSignInAt(identity.id, user.id, tx);
      } catch (error) {
        this.logger.error(error, "AuthService.signIn");
      }

      return {
        code: HttpResultCode.OK,
        data: {
          token: token.token,
          tokenType: TokenType.Bearer,
          expiresIn: token.expiresIn,
          expiresAt: token.expiresAt,
          refreshToken: token.refreshToken,
          user: token.user,
        },
      };
    });
  }

  /**
   * @description 회원가입
   * @param {SignupDTO} input
   */
  async signUp(input: SignUpDTO) {
    switch (input.provider) {
      case Provider.PASSWORD: {
        return await this._signUpWithPassword(input);
      }
      default: {
        throw new UnauthorizedException(
          OpenApiAuthErrorDefine.unsupportedAuthMethod,
        );
      }
    }
  }

  /**
   * @description 이메일로 회원가입
   * @param {SignupDTO} input
   */
  private async _signUpWithPassword(input: SignUpDTO) {
    // 이메일 중복 체크
    const user = await this.usersService.isDuplicatedEmail(input.email);

    if (user) {
      // 이미 존재하는 이메일
      throw new BadRequestException(OpenApiAuthErrorDefine.emailAlreadyExists);
    }

    return await this.prismaService.$transaction(
      async (tx) => {
        const { hashedPassword: password, salt } =
          await this.passwordServie.hashPassword(input.password);

        // 이메일로 유저 생성
        const user = await this.usersService.createNewUser(
          {
            email: input.email,
            username: this.usersService.makeRandomUsername(input.username),
            password,
            salt,
          },
          tx,
        );

        const role = await this.roleService.findRole(Role.USER, tx);
        if (!role) {
          // Role이 없는 경우
          throw new NotFoundException(OpenApiAuthErrorDefine.roleNotFound);
        }

        // 가져온 Role과 User를 연결
        await this.roleService.linkRoleToUser(user.id, role.id, tx);

        // Identity 찾기
        let identity = await this.identityService.findIdentityByIdAndProvider(
          user.id,
          Provider.EMAIL,
          tx,
        );

        if (!identity) {
          // Identity 생성
          identity = await this.identityService.createNewIdentity(
            {
              userId: user.id,
              provider: Provider.EMAIL,
              identityData: {
                sub: user.id,
                email: user.email,
              },
            },
            tx,
          );

          // User와 Identity를 연결
          await this.identityService.linkIdentityToUser(
            user.id,
            identity.id,
            tx,
          );
        }

        // Refresh Token 발급
        const token = await this.tokenService.issueRefreshToken(
          {
            userId: user.id,
            ip: hash(this.request.ip),
            userAgent: this.request.headers["user-agent"],
          },
          tx,
        );

        try {
          // 마지막 로그인 시간 업데이트
          await this.usersService.updateLastSignInAt(user.id, tx);
          await this.identityService.updateLastSignInAt(
            identity.id,
            user.id,
            tx,
          );
        } catch (error) {
          this.logger.error(
            "AuthService.signUp",
            "Error while updating last sign in at",
            error,
          );
        }

        return {
          code: HttpResultCode.OK,
          data: {
            token: token.token,
            tokenType: TokenType.Bearer,
            expiresIn: token.expiresIn,
            expiresAt: token.expiresAt,
            refreshToken: token.refreshToken,
            user: token.user,
          },
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // 격리 수준 지정
      },
    );
  }

  /**
   * @description 토큰 발급
   * @param {TokenDTO} input
   * @param {TokenQueryDTO} params
   */
  async token(input: TokenDTO, params: TokenQueryDTO) {
    if (params.grantType === GrantType.REFRESH_TOKEN) {
      return await this.refreshTokenGrant(input);
    }

    throw new UnauthorizedException(
      OpenApiAuthErrorDefine.unsupportedGrantType,
    );
  }

  /**
   * @description refresh token을 이용하여 토큰을 재발급합니다.
   * @param {TokenDTO} input
   */
  async refreshTokenGrant(input: TokenDTO) {
    const retryStart = Date.now();
    const retryLoopDuration = 5000;
    let retry = true;

    while (retry && Date.now() - retryStart < retryLoopDuration) {
      retry = false;

      const data = await this.usersService.findUserWithRefreshToken(input);

      if (!data) {
        throw new BadRequestException(OpenApiAuthErrorDefine.invalidToken);
      }

      const { session, token, user } = data;

      // 사용자가 정지되었는지 확인
      if (user.isSuspended) {
        throw new ForbiddenException(OpenApiAuthErrorDefine.suspensionUser);
      }

      // 세션이 만료되었는지 확인
      if (session.notAfter && isAfter(retryStart, session.notAfter)) {
        throw new BadRequestException(OpenApiAuthErrorDefine.expiredToken);
      }

      return await this.prismaService.$transaction(
        async (tx) => {
          let issuedToken: RefreshToken | null = null;
          if (token.revoked) {
            const activeRefreshToken =
              await this.tokenService.findCurrentlyActiveRefreshToken(
                session.id,
                tx,
              );
            if (
              activeRefreshToken &&
              activeRefreshToken.parent == token.token
            ) {
              // Token was revoked, but it's the
              // parent of the currently active one.
              // This indicates that the client was
              // not able to store the result when it
              // refreshed token. This case is
              // allowed, provided we return back the
              // active refresh token instead of
              // creating a new one.
              issuedToken = activeRefreshToken;
            } else {
              // For a revoked refresh token to be reused, it
              // has to fall within the reuse interval.
              if (isAfter(retryStart, token.updatedAt)) {
                try {
                  await this.tokenService.revokeTokenFamily(
                    {
                      sessionId: token.sessionId,
                      token: token.token,
                    },
                    tx,
                  );
                } catch (error) {
                  throw new InternalServerErrorException(error);
                }

                throw new BadRequestException(
                  OpenApiAuthErrorDefine.refreshTokenAlreadyUsed,
                );
              }
            }
          }

          const ip = hash(this.request.ip);
          const userAgent = this.request.headers["user-agent"];

          if (!issuedToken) {
            issuedToken = await this.tokenService.grantRefreshTokenSwap(
              {
                userId: user.id,
                ip,
                userAgent,
                token,
              },
              tx,
            );
          }

          await this.sessionService.updateSession(
            {
              sessionId: issuedToken.sessionId,
              ip,
              userAgent,
              refreshedAt: new Date(),
            },
            tx,
          );

          const newToken = await this.tokenService.generateAccessToken(
            {
              sessionId: issuedToken.sessionId,
              userId: issuedToken.userId,
            },
            tx,
          );

          return {
            code: HttpResultCode.OK,
            data: {
              token: newToken.token,
              tokenType: TokenType.Bearer,
              expiresIn: newToken.expiresIn,
              expiresAt: newToken.expiresAt,
              refreshToken: issuedToken.token,
              user: newToken.user,
            },
          };
        },
        {
          maxWait: 5000, // 최대 대기 시간 설정 (default: 2000)
          timeout: 10000, // 타임아웃 설정 (default: 5000)
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // 격리 수준 지정
        },
      );
    }

    throw new ConflictException(
      OpenApiAuthErrorDefine.tooManyTokenRefreshRequests,
    );
  }

  /**
   * @description 로그아웃
   * @param {UserExternalPayload} user
   */
  async logout(user: UserExternalPayload) {
    return await this.prismaService.$transaction(async (tx) => {
      await tx.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
      return {
        code: HttpResultCode.OK,
        data: true,
      };
    });
  }

  /**
   * @description 토큰을 이용하여 사용자 또는 세션을 로드합니다.
   * @param {JwtPayload} payload
   */
  async maybeLoadUserOrSession(payload: JwtPayload) {
    if (!payload.sub) {
      throw new BadRequestException(OpenApiAuthErrorDefine.invalidToken);
    }

    const user = await this.usersService.findUserByIdExternal(payload.sub);

    if (!user) {
      throw new NotFoundException(OpenApiAuthErrorDefine.notFoundUser);
    }

    let session: Session | undefined;

    if (payload.sessionId) {
      session = await this.sessionService.findSessionByID(payload.sessionId);

      if (!session) {
        throw new UnauthorizedException(OpenApiAuthErrorDefine.notLogin);
      }
    }

    return {
      user,
      session,
    };
  }
}
