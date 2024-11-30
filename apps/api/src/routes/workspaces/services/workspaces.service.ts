import { Injectable, NotFoundException } from "@nestjs/common";
import { toFinite } from "lodash-es";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import {
  ListWorkspaceDto,
  WorkspaceOrderByEnum,
} from "../dto/list-workspace.dto";
import { UpdateWorkspaceDto } from "../dto/update-workspace.dto";
import { OpenApiErrorDefine } from "../open-api";

@Injectable()
export class WorkspacesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @description 워크스페이스 생성
   * @param {UserExternalPayload} user
   * @param {CreateWorkspaceDto} body
   */
  async create(user: UserExternalPayload, body: CreateWorkspaceDto) {
    const data = await this.prismaService.workSpace.create({
      data: { ...body, userId: user.id },
    });
    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  /**
   * @description 워크스페이스 목록 조회
   * @param {UserExternalPayload} user
   * @param {ListWorkspaceDto} query
   */
  async findAll(user: UserExternalPayload, query: ListWorkspaceDto) {
    const pageNo = toFinite(query.pageNo);

    const limit = query.limit ? toFinite(query.limit) : 0;

    const [totalCount, list] = await Promise.all([
      this.prismaService.workSpace.count({
        where: {
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
        },
      }),
      this.prismaService.workSpace.findMany({
        where: {
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
        },
        orderBy: {
          ...(query.orderBy === WorkspaceOrderByEnum.UPDATED_AT
            ? { updatedAt: "desc" }
            : {
                createdAt: "desc",
              }),
        },
        take: limit ? limit : undefined,
        skip: limit ? (pageNo - 1) * limit : undefined,
      }),
    ]);

    const hasNextPage = limit ? totalCount > pageNo * limit : false;
    const nextPage = limit ? (hasNextPage ? pageNo + 1 : null) : null;

    return {
      code: HttpResultCode.OK,
      data: {
        totalCount,
        list,
        pageInfo: {
          currentPage: pageNo,
          hasNextPage,
          nextPage,
        },
      },
    };
  }

  /**
   * @description 워크스페이스 단건 조회
   * @param {UserExternalPayload} user
   * @param {number} id
   */
  async findOne(user: UserExternalPayload, id: number) {
    const data = await this.prismaService.workSpace.findFirst({
      where: { id, userId: user.id },
    });

    if (!data) {
      throw new NotFoundException(OpenApiErrorDefine.workspaceNotFound);
    }

    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  update(id: number, body: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace` + JSON.stringify(body);
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
