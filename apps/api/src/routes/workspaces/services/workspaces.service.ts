import { Injectable, NotFoundException } from "@nestjs/common";
import { isEqual, toFinite } from "lodash-es";
import { SortOrder } from "src/types/sort-order";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { ListWorkspaceDto } from "../dto/list-workspace.dto";
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
   * @param {boolean} isDeleted
   */
  async findMany(
    user: UserExternalPayload,
    query: ListWorkspaceDto,
    isDeleted = false,
  ) {
    const pageNo = toFinite(query.pageNo);

    const limit = query.limit ? toFinite(query.limit) : 0;
    const favorites = query.favorites ? query.favorites : [];

    const [totalCount, list] = await Promise.all([
      this.prismaService.workSpace.count({
        where: {
          ...(isDeleted
            ? { deletedAt: { not: null } }
            : {
                deletedAt: {
                  equals: null,
                },
              }),
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
          ...(favorites.length > 0 && {
            OR: favorites.map((i) => ({
              isFavorite: i,
            })),
          }),
        },
      }),
      this.prismaService.workSpace.findMany({
        where: {
          ...(isDeleted
            ? { deletedAt: { not: null } }
            : {
                deletedAt: {
                  equals: null,
                },
              }),
          userId: user.id,
          ...(query.title && { title: { contains: query.title } }),
          ...(favorites.length > 0 && {
            OR: favorites.map((i) => ({
              isFavorite: i,
            })),
          }),
        },
        orderBy: {
          ...(query.sortTag && {
            [query.sortTag]: query.sortOrder ?? SortOrder.ASC,
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
   * @description 삭제된 워크스페이스 목록 조회
   * @param {UserExternalPayload} user
   * @param {ListWorkspaceDto} query
   */
  async findManyByDeleted(user: UserExternalPayload, query: ListWorkspaceDto) {
    return await this.findMany(user, query, true);
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

  /**
   * @description 워크스페이스 수정
   * @param {UserExternalPayload} user
   * @param {number} id
   * @param {UpdateWorkspaceDto} body
   */
  async update(
    user: UserExternalPayload,
    id: number,
    body: UpdateWorkspaceDto,
  ) {
    const workspace = await this.prismaService.workSpace.findFirst({
      where: { id, userId: user.id },
    });

    if (!workspace) {
      throw new NotFoundException(OpenApiErrorDefine.workspaceNotFound);
    }

    Object.assign(body, {
      title: body.title
        ? isEqual(body.title, workspace.title)
          ? undefined
          : body.title
        : undefined,
      description: body.description
        ? isEqual(body.description, workspace.description)
          ? undefined
          : body.description
        : undefined,
    });

    const data = await this.prismaService.workSpace.update({
      where: { id, userId: user.id },
      data: body,
    });

    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  /**
   * @description 워크스페이스 삭제
   * @param {UserExternalPayload} user
   * @param {number} id
   */
  async remove(user: UserExternalPayload, id: number) {
    const data = await this.prismaService.workSpace.update({
      where: { id, userId: user.id },
      data: { deletedAt: new Date() },
    });

    return {
      code: HttpResultCode.OK,
      data,
    };
  }

  /**
   * @description 워크스페이스 즐겨찾기 설정
   * @param {UserExternalPayload} user
   * @param {number} id
   * @param {boolean} isFavorite
   */
  async favorite(user: UserExternalPayload, id: number, isFavorite: boolean) {
    const data = await this.prismaService.workSpace.update({
      where: { id, userId: user.id },
      data: { isFavorite },
    });
    return {
      code: HttpResultCode.OK,
      data,
    };
  }
}
