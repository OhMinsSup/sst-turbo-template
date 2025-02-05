import { Injectable } from "@nestjs/common";
import { RoleEnum } from "@veloss/constants/auth";

import { Prisma } from "@template/db";

import { PrismaService } from "../../../integrations/prisma/prisma.service";

interface CreateRoleParams {
  name: string;
  symbol: RoleEnum;
  description?: string;
}

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @description Role 가져오기
   * @param {RoleEnum} role
   * @param {Prisma.TransactionClient?} tx
   */
  async findRole(
    role: RoleEnum,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.role : this.prismaService.role;
    return await ctx.findUnique({
      where: {
        symbol: role,
      },
    });
  }

  /**
   * @description Role 가져오기, 없으면 에러 발생
   * @param {RoleEnum} role
   * @param {Prisma.TransactionClient?} tx
   */
  async findRoleOnThrowError(
    role: RoleEnum,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.role : this.prismaService.role;
    return await ctx.findUniqueOrThrow({
      where: {
        symbol: role,
      },
    });
  }

  /**
   * @description Role 생성
   * @param {CreateRoleParams} input
   * @param {Prisma.TransactionClient?} tx
   */
  async createRole(
    input: CreateRoleParams,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.role : this.prismaService.role;
    return await ctx.create({
      data: {
        name: input.name,
        symbol: input.symbol,
        description: input.description,
      },
    });
  }

  /**
   * @description Role과 User를 연결
   * @param {string} userId
   * @param {string} roleId
   * @param {Prisma.TransactionClient?} tx
   */
  async linkRoleToUser(
    userId: string,
    roleId: string,
    tx: Prisma.TransactionClient | undefined = undefined,
  ) {
    const ctx = tx ? tx.role : this.prismaService.role;
    return await ctx.update({
      where: {
        id: roleId,
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
}
