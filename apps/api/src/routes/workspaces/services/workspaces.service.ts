import { Injectable, NotFoundException } from "@nestjs/common";
import { toFinite } from "lodash-es";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { ListWorkspaceDto } from "../dto/list-workspace.dto";
import { UpdateWorkspaceDto } from "../dto/update-workspace.dto";
import { WorkspaceErrorService } from "../errors/workspace-error.service";

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workpsaceError: WorkspaceErrorService,
  ) {}

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

    const limit = query.limit ? toFinite(query.limit) : 20;

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
          createdAt: "desc",
        },
        take: limit,
        skip: (pageNo - 1) * limit,
      }),
    ]);

    const hasNextPage = totalCount > pageNo * limit;

    return {
      code: HttpResultCode.OK,
      data: {
        totalCount,
        list,
        pageInfo: {
          currentPage: pageNo,
          hasNextPage,
          nextPage: hasNextPage ? pageNo + 1 : null,
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
      throw new NotFoundException(this.workpsaceError.workspaceNotFound());
    }

    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  update(id: number, body: UpdateWorkspaceDto) {
    console.log(body);
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
