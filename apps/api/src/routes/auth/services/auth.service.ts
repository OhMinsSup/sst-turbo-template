import type { Request } from "express";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { HttpResultCode, Provider, Role } from "@template/common";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { hash } from "../../../libs/hash";
import { RoleService } from "../../../routes/role/services/role.service";
import { UsersService } from "../../../routes/users/services/users.service";
import { SignInDTO } from "../dto/signin.dto";
import { SignUpDTO } from "../dto/signup.dto";
import { TokenDTO } from "../dto/token.dto";
import { AuthErrorService } from "../errors/auth-error.service";
import { IdentityService } from "./identity.service";
import { PasswordService } from "./password.service";
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
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly passwordServie: PasswordService,
    private readonly roleService: RoleService,
    private readonly identityService: IdentityService,
    private readonly sessionService: SessionService,
    private readonly authError: AuthErrorService,
    @Inject(REQUEST) private request: Request,
  ) {}

  /**
   * @description 로그인
   * @param {SignInDTO} input
   */
  async signIn(input: SignInDTO) {
    switch (input.provider) {
      case Provider.EMAIL: {
        return await this._signInWithEmail(input);
      }
      default: {
        throw new UnauthorizedException(this.authError.unsupportedAuthMethod());
      }
    }
  }

  /**
   * @description 이메일로 로그인
   * @param {SignInDTO} input
   */
  private async _signInWithEmail(input: SignInDTO) {
    const user = await this.usersService.isDuplicatedEmailWithEncryptedPassword(
      input.email,
    );

    if (!user) {
      throw new NotFoundException(this.authError.notFoundUser());
    }

    const compare = await this.passwordServie.compare(
      input.password,
      user.encryptedSalt,
      user.encryptedPassword,
    );

    if (!compare) {
      throw new BadRequestException(this.authError.incorrectPassword());
    }

    return await this.prisma.$transaction(async (tx) => {
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
        await this.identityService.linkIdentityToUser(user.id, identity.id, tx);
      }

      const issueTokenParams = {
        userId: user.id,
        ip: hash(this.request.ip),
        userAgent: this.request.headers["user-agent"],
      };

      // Refresh Token 발급
      const token = await this.tokenService.issueRefreshToken(
        issueTokenParams,
        tx,
      );

      try {
        // 마지막 로그인 시간 업데이트
        await this.usersService.updateLastSignInAt(user.id, tx);
        await this.identityService.updateLastSignInAt(identity.id, user.id, tx);
      } catch (error) {
        console.error(error);
      }

      return {
        code: HttpResultCode.OK,
        data: token,
      };
    });
  }

  /**
   * @description 회원가입
   * @param {SignupDTO} input
   */
  async signUp(input: SignUpDTO) {
    switch (input.provider) {
      case Provider.EMAIL: {
        return await this._signUpWithEmail(input);
      }
      default: {
        throw new UnauthorizedException(this.authError.unsupportedAuthMethod());
      }
    }
  }

  /**
   * @description 이메일로 회원가입
   * @param {SignupDTO} input
   */
  private async _signUpWithEmail(input: SignUpDTO) {
    // 이메일 중복 체크
    const user = await this.usersService.isDuplicatedEmail(input.email);

    if (user) {
      // 이미 존재하는 이메일
      throw new BadRequestException(this.authError.emailAlreadyExists());
    }

    return await this.prisma.$transaction(async (tx) => {
      const { hashedPassword: password, salt } =
        await this.passwordServie.hashPassword(input.password);

      const newUserParams = {
        email: input.email,
        username: this.usersService.makeRandomUsername(input.username),
        password,
        salt,
      };

      // 이메일로 유저 생성
      const user = await this.usersService.createNewUser(newUserParams, tx);

      const role = await this.roleService.findRole(Role.USER, tx);
      if (!role) {
        // Role이 없는 경우
        throw new NotFoundException(this.authError.roleNotFound());
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
        await this.identityService.linkIdentityToUser(user.id, identity.id, tx);
      }

      const issueTokenParams = {
        userId: user.id,
        ip: hash(this.request.ip),
        userAgent: this.request.headers["user-agent"],
      };

      // Refresh Token 발급
      const token = await this.tokenService.issueRefreshToken(
        issueTokenParams,
        tx,
      );

      try {
        // 마지막 로그인 시간 업데이트
        await this.usersService.updateLastSignInAt(user.id, tx);
        await this.identityService.updateLastSignInAt(identity.id, user.id, tx);
      } catch (error) {
        console.error(error);
      }

      return {
        code: HttpResultCode.OK,
        data: token,
      };
    });
  }

  /**
   * @description 토큰 발급
   * @param {TokenDTO} input
   */
  async token(input: TokenDTO) {
    return await this.refreshTokenGrant(input);
  }

  async refreshTokenGrant(input: TokenDTO) {
    const retryStart = Date.now();
    let retry = true;

    const retryLoopDuration = 5.0;

    while (retry && Date.now() - retryStart < retryLoopDuration) {
      retry = false;
      console.log("retry");
      const data = await this.usersService.findUserWithRefreshToken(
        input.refreshToken,
      );

      if (!data) {
        throw new UnauthorizedException(this.authError.invalidToken());
      }

      if (data.user.isSuspended) {
        throw new UnauthorizedException(this.authError.suspensionUser());
      }
    }
  }

  /**
   * @description 토큰을 이용하여 사용자 또는 세션을 로드합니다.
   * @param {JwtPayload} payload
   */
  async maybeLoadUserOrSession(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException(this.authError.invalidToken());
    }

    const user = await this.usersService.findUserByIdExternal(payload.sub);

    if (!user) {
      throw new NotFoundException(this.authError.notFoundUser());
    }

    if (payload.sessionId) {
      const session = await this.sessionService.findSessionByID(
        payload.sessionId,
      );

      if (!session) {
        throw new UnauthorizedException(this.authError.notLogin());
      }
    }

    return {
      user,
    };
  }
}
