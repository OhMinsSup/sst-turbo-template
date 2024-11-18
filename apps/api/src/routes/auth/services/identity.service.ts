import { Injectable } from "@nestjs/common";

import { Provider } from "@template/common";
import { Prisma } from "@template/db";
import { getIdentityWithoutUserIdSelector } from "@template/db/selectors";

import { PrismaService } from "../../../integrations/prisma/prisma.service";

interface CreateNewIdentityParams {
  userId: string;
  provider: Provider;
  identityData: Record<string, string>;
}

interface UpdateIdentityParams extends CreateNewIdentityParams {
  identityId: string;
}

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description Identity 가져오기 (providerId와 provider가 일치하는 ID를 검색합니다.)
   * @param {string} providerId
   * @param {string} provider
   * @param {Prisma.TransactionClient?} tx
   */
  findIdentityByIdAndProvider(
    providerId: string,
    provider: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.identity : this.prisma.identity;
    return ctx.findFirst({
      where: {
        provider,
        providerId,
      },
      select: getIdentityWithoutUserIdSelector(),
    });
  }

  /**
   * @description Identity 가져오기, 없으면 에러 발생 (providerId와 provider가 일치하는 ID를 검색합니다.)
   * @param {string} providerId
   * @param {string} provider
   * @param {Prisma.TransactionClient?} tx
   */
  findIdentityByIdAndProviderOrThrowError(
    providerId: string,
    provider: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.identity : this.prisma.identity;
    return ctx.findFirstOrThrow({
      where: {
        provider,
        providerId,
      },
      select: getIdentityWithoutUserIdSelector(),
    });
  }

  /**
   * @description Role과 User를 연결
   * @param {string} userId
   * @param {string} identityId
   * @param {Prisma.TransactionClient?} tx
   */
  async linkIdentityToUser(
    userId: string,
    identityId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.identity : this.prisma.identity;
    return await ctx.update({
      where: {
        id: identityId,
      },
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * @description Identity 생성 (이메일)
   * @param {CreateNewIdentityParams} params
   * @param {Prisma.TransactionClient?} tx
   */
  async createNewIdentity(
    { userId, provider, identityData }: CreateNewIdentityParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const providerId = "sub" in identityData ? identityData.sub : undefined;
    if (!providerId) {
      throw new Error("Invalid providerId");
    }

    const now = new Date();
    const email = "email" in identityData ? identityData.email : undefined;
    const ctx = tx ? tx.identity : this.prisma.identity;
    return await ctx.create({
      data: {
        provider,
        providerId,
        userId,
        email,
        identityData: JSON.stringify(identityData),
        lastSignInAt: now,
      },
      select: getIdentityWithoutUserIdSelector(),
    });
  }

  /**
   * @description Identity 수정 (이메일)
   * @param {UpdateIdentityParams} params
   * @param {Prisma.TransactionClient?} tx
   */
  async updateIdentity(
    { userId, provider, identityData, identityId }: UpdateIdentityParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const providerId = "sub" in identityData ? identityData.sub : undefined;
    if (!providerId) {
      throw new Error("Invalid providerId");
    }

    const now = new Date();
    const email = "email" in identityData ? identityData.email : undefined;
    const ctx = tx ? tx.identity : this.prisma.identity;
    return await ctx.update({
      where: {
        id: identityId,
        userId,
        provider,
      },
      data: {
        provider,
        providerId,
        email,
        identityData: JSON.stringify(identityData),
        lastSignInAt: now,
      },
      select: getIdentityWithoutUserIdSelector(),
    });
  }

  /**
   * @description identity의 마지막 로그인 시간을 업데이트합니다.
   * @param {string} identityId
   * @param {string} userId
   * @param {Prisma.TransactionClient?} tx
   */
  updateLastSignInAt(
    identityId: string,
    userId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const now = new Date();
    const ctx = tx ? tx.identity : this.prisma.identity;
    return ctx.update({
      where: {
        id: identityId,
        userId,
      },
      data: {
        lastSignInAt: now,
      },
    });
  }
}
