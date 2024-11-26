import { Injectable, NotFoundException } from "@nestjs/common";

import type { UserExternalPayload } from "@template/db/selectors";
import { HttpResultCode } from "@template/common";

import { PrismaService } from "../../../integrations/prisma/prisma.service";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
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

  findAll() {
    return `This action returns all workspaces`;
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
