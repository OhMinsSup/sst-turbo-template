import { Injectable } from "@nestjs/common";

import type { Prisma } from "@template/db";
import {
  getBaseUserSelector,
  getSessionWithoutUserIdSelector,
} from "@template/db/selectors";

import { PrismaService } from "../../../integrations/prisma/prisma.service";

interface CreateNewSessionParams {
  userId: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  checkValidity() {}

  /**
   * @description 새로운 세션을 생성합니다.
   * @param {CreateNewSessionParams} param
   * @param {Prisma.TransactionClient?} tx
   */
  createNewSession(
    { userId, ip, userAgent }: CreateNewSessionParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prisma.session;
    return ctx.create({
      data: {
        userId,
        ip,
        userAgent,
      },
      select: {
        ...getSessionWithoutUserIdSelector(),
        User: {
          select: {
            ...getBaseUserSelector(),
            Role: {
              select: {
                symbol: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * @description 세션을 ID로 찾습니다.
   * @param {string} sessionId
   * @param {Prisma.TransactionClient?} tx
   */
  findSessionByID(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prisma.session;
    return ctx.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        ...getSessionWithoutUserIdSelector(),
        User: {
          select: {
            ...getBaseUserSelector(),
            Role: {
              select: {
                symbol: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * @description 세션을 ID로 찾습니다. 없으면 에러를 발생시킵니다.
   * @param {string} sessionId
   * @param {Prisma.TransactionClient?} tx
   */
  findSessionByIDOrThrowError(
    sessionId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.session : this.prisma.session;
    return ctx.findUniqueOrThrow({
      where: {
        id: sessionId,
      },
      select: {
        ...getSessionWithoutUserIdSelector(),
        User: {
          select: {
            ...getBaseUserSelector(),
            Role: {
              select: {
                symbol: true,
              },
            },
          },
        },
      },
    });
  }
}
