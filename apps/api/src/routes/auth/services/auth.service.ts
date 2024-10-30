import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { subMilliseconds } from "date-fns";

import { HttpResultStatus } from "@template/sdk";

import { LoggerService } from "../../../integrations/logger/logger.service";
import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { AppTokenType } from "../../../libs/constants";
import { UsersService } from "../../../routes/users/services/users.service";
import { AuthResponseDto } from "../../../shared/dtos/response/auth/auth-response.dto";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { SigninDTO } from "../dto/signin.dto";
import { SignoutDTO } from "../dto/signout.dto";
import { SignupDTO } from "../dto/signup.dto";
import { VerifyTokenDTO } from "../dto/verify-token.dto";
import {
  AuthAlreadyExistEmailErrorCode,
  AuthErrorDefine,
  AuthIncorrectPasswordErrorCode,
  AuthNotExistEmailErrorCode,
  AuthNotExistUserErrorCode,
  AuthTokenNotExistErrorCode,
} from "../errors";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";

const generatorName = (seed: string) => {
  const makeRandomString = (length: number) => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  return `${seed}_${makeRandomString(10)}`;
};

@Injectable()
export class AuthService {
  private _contextName = "auth - service";

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly token: TokenService,
    private readonly user: UsersService,
    private readonly password: PasswordService,
  ) {}

  /**
   * @description Verify Token Handler
   * @param {VerifyTokenDTO} input
   */
  async verifyToken(input: VerifyTokenDTO) {
    const jwtDto = await this.token.getAccessTokenPayload(input.token);
    const token = await this.token.findByTokenId(jwtDto.jti);
    if (!token) {
      throw new NotFoundException(AuthErrorDefine[AuthTokenNotExistErrorCode]);
    }

    const user = await this.user.checkUserById(jwtDto.sub);
    if (!user) {
      throw new NotFoundException(AuthErrorDefine[AuthNotExistUserErrorCode]);
    }

    return {
      resultCode: HttpResultStatus.OK,
      result: true,
    };
  }

  /**
   * @description Refresh Handler
   * @param {RefreshTokenDTO} input
   */
  async refresh(input: RefreshTokenDTO): Promise<{
    resultCode: HttpResultStatus;
    data: AuthResponseDto;
  }> {
    const jwtDto = await this.token.getRefreshTokenPayload(input.refreshToken);
    const token = await this.token.findByTokenId(jwtDto.jti);
    if (!token) {
      throw new NotFoundException(AuthErrorDefine[AuthTokenNotExistErrorCode]);
    }

    const user = await this.user.getUserById(jwtDto.sub);
    if (!user) {
      throw new NotFoundException(AuthErrorDefine[AuthNotExistUserErrorCode]);
    }

    // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
    await this.token.deleteByExpiresAtTokens({
      userId: user.id,
      expiresAt: subMilliseconds(token.expires.getTime(), 1000),
      tokenType: AppTokenType.RefreshToken,
    });

    const accessToken = this.token.generateAccessToken(user.id);
    const refreshToken = await this.token.generateRefreshToken(
      user.id,
      accessToken.token,
    );

    return {
      resultCode: HttpResultStatus.OK,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  /**
   * @description Signin Handler
   * @param {SigninDTO} input
   */
  async signin(input: SigninDTO): Promise<{
    resultCode: HttpResultStatus;
    data: AuthResponseDto;
  }> {
    const user = await this.user.getInternalUserByEmail(input.email);

    if (!user) {
      throw new NotFoundException(AuthErrorDefine[AuthNotExistEmailErrorCode]);
    }

    const isMatch = await this.password.compare(
      input.password,
      user.Password.salt,
      user.Password.hash,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        AuthErrorDefine[AuthIncorrectPasswordErrorCode],
      );
    }

    const accessToken = this.token.generateAccessToken(user.id);
    const refreshToken = await this.token.generateRefreshToken(
      user.id,
      accessToken.token,
    );

    // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
    await this.token.deleteByExpiresAtTokens({
      userId: user.id,
      expiresAt: subMilliseconds(refreshToken.expiresAt.getTime(), 1000),
      tokenType: AppTokenType.RefreshToken,
    });

    return {
      resultCode: HttpResultStatus.OK,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  /**
   * @description Signup Handler
   * @param {SignupDTO} input
   */
  async signup(input: SignupDTO): Promise<{
    resultCode: HttpResultStatus;
    data: AuthResponseDto;
  }> {
    const user = await this.user.checkUserByEmail(input.email);

    if (user) {
      throw new BadRequestException(
        AuthErrorDefine[AuthAlreadyExistEmailErrorCode],
        "중복 회원가입 요청할때 발생하는 오류",
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const { hashedPassword, salt } = await this.password.hashPassword(
        input.password,
      );

      const emailSplit = input.email.split("@").at(0) ?? "username";

      const user = await this.user.createUser(
        {
          email: input.email,
          name: input.name ?? generatorName(emailSplit),
          password: hashedPassword,
          salt: salt,
        },
        tx,
      );

      // 인증 토큰 생성
      const accessToken = this.token.generateAccessToken(user.id);
      // 리프레시 토큰 생성
      const refreshToken = await this.token.generateRefreshToken(
        user.id,
        accessToken.token,
        tx,
      );

      // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
      const conditionExpiredAt = subMilliseconds(
        refreshToken.expiresAt.getTime(),
        1000,
      );

      // 현재 발급한 token의 만료일 이전에 만료된 token을 삭제
      await this.token.deleteByExpiresAtTokens(
        {
          userId: user.id,
          expiresAt: conditionExpiredAt,
          tokenType: AppTokenType.RefreshToken,
        },
        tx,
      );

      return {
        resultCode: HttpResultStatus.OK,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    });
  }

  /**
   * @description Signout Handler
   * @param {SignoutDTO} input
   */
  async signout(input: SignoutDTO): Promise<{
    resultCode: HttpResultStatus;
    data: boolean;
  }> {
    const jwtDto = await this.token.getAccessTokenPayload(input.accessToken);
    const token = await this.token.findByTokenId(jwtDto.jti);
    if (!token) {
      throw new NotFoundException(AuthErrorDefine[AuthTokenNotExistErrorCode]);
    }

    const user = await this.user.checkUserById(jwtDto.sub);
    if (!user) {
      throw new NotFoundException(AuthErrorDefine[AuthNotExistUserErrorCode]);
    }

    await this.token.deleteByAccessToken(input.accessToken);

    return {
      resultCode: HttpResultStatus.OK,
      data: true,
    };
  }
}
