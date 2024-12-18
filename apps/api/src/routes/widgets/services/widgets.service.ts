import { Injectable } from "@nestjs/common";
import { toFinite } from "lodash-es";

import { HttpResultCode } from "@template/common";
import { UserExternalPayload } from "@template/db/selectors";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { SortOrder } from "../../../types/sort-order";
import { ListWorkspaceWidgetDto } from "../dto/list-workspace-widget.dto";

@Injectable()
export class WidgetsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * @description 워크스페이스와 즐겨찾기 워크스페이스 목록 조회
   * @param {UserExternalPayload} user
   * @param {ListWorkspaceWidgetDto} query
   */
  async findAllByWidgetWorkspace(
    user: UserExternalPayload,
    query: ListWorkspaceWidgetDto,
  ) {
    const limit = query.limit ? toFinite(query.limit) : 5;

    const [favoriteWorkspaces, workspaces] = await Promise.all([
      this.prismaService.workSpace.findMany({
        where: {
          deletedAt: {
            equals: null,
          },
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
          isFavorite: true,
        },
        orderBy: {
          ...(query.sortTag && {
            [query.sortTag]: query.sortOrder ?? SortOrder.ASC,
          }),
        },
        take: limit,
      }),
      this.prismaService.workSpace.findMany({
        where: {
          deletedAt: {
            equals: null,
          },
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
          isFavorite: false,
        },
        orderBy: {
          ...(query.sortTag && {
            [query.sortTag]: query.sortOrder ?? SortOrder.ASC,
          }),
        },
        take: limit,
      }),
    ]);

    return {
      code: HttpResultCode.OK,
      data: {
        favoriteWorkspaces,
        workspaces,
      },
    };
  }
}
