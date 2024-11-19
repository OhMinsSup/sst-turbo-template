import { Injectable } from "@nestjs/common";

import { Role } from "@template/common";
import { Prisma } from "@template/db";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { RoleCreateDTO } from "../dto/role-create.dto";

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @description Role 가져오기
   * @param {Role} role
   * @param {Prisma.TransactionClient?} tx
   */
  async findRole(
    role: Role,
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
   * @param {Role} role
   * @param {Prisma.TransactionClient?} tx
   */
  async findRoleOnThrowError(
    role: Role,
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
   * @param {RoleCreateDTO} input
   * @param {Prisma.TransactionClient?} tx
   */
  async createRole(
    input: RoleCreateDTO,
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
