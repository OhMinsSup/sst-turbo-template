import { Injectable } from "@nestjs/common";

import type { Prisma } from "@template/db";

import { PrismaService } from "../../../integrations/prisma/prisma.service";

interface CreateNewSessionParams {
  userId: string;
  ip?: string;
  userAgent?: string;
}

interface UpdateSessionParams
  extends Pick<CreateNewSessionParams, "ip" | "userAgent"> {
  refreshedAt: Date;
  sessionId: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @description 새로운 세션을 생성합니다.
   * @param {CreateNewSessionParams} param
   * @param {Prisma.TransactionClient?} tx
   */
  createNewSession(
    { userId, ip, userAgent }: CreateNewSessionParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prismaService.session;
    return ctx.create({
      data: {
        userId,
        ip,
        userAgent,
      },
    });
  }

  /**
   * @description 세션을 ID로 찾습니다.
   * @param {string} sessionId
   * @param {Prisma.TransactionClient?} tx
   */
  findSessionByIDWithUser(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prismaService.session;
    return ctx.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  findSessionByID(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prismaService.session;
    return ctx.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  /**
   * @description 세션을 ID로 찾습니다. 없으면 에러를 발생시킵니다.
   * @param {string} sessionId
   * @param {Prisma.TransactionClient?} tx
   */
  findSessionByIDWithUserOrThrowError(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prismaService.session;
    return ctx.findUniqueOrThrow({
      where: {
        id: sessionId,
      },
    });
  }

  /**
   * @description 세션을 업데이트합니다.
   * @param {UpdateSessionParams} param
   * @param {Prisma.TransactionClient?} tx
   */
  updateSession(
    { sessionId, ip, userAgent, refreshedAt }: UpdateSessionParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prismaService.session;
    return ctx.update({
      where: {
        id: sessionId,
      },
      data: {
        ip,
        userAgent,
        refreshedAt,
      },
    });
  }
}
