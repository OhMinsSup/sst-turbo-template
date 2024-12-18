import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { WorkspaceService } from "~/.server/routes/workspaces/services/workspace.service";
import { auth } from "~/.server/utils/auth";
import {
  invariantToastError,
  invariantUnsupportedMethod,
} from "~/.server/utils/shared";

@singleton()
@injectable()
export class WorkspaceController {
  constructor(
    @inject(WorkspaceService.name)
    private readonly workspaceService: WorkspaceService,
  ) {}

  /**
   * @description 워크스페이스 생성
   * @param {ActionFunctionArgs} args
   */
  async create(args: ActionFunctionArgs) {
    const response = await this.workspaceService.create(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    if (!response.data.success) {
      return data(response.data, {
        headers: response.requestInfo.headers,
      });
    }

    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAll(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAll(args);
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 삭제된 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByDeleted(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAllByDeleted(args);
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 리스트 조회 (json fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllToJson(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAll(args);
    return Response.json(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 삭제된 워크스페이스 리스트 조회 (json fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByDeletedToJson(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAllByDeleted(args);
    return Response.json(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 삭제
   * @param {ActionFunctionArgs} args
   */
  async remove(args: ActionFunctionArgs) {
    const response = await this.workspaceService.remove(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 복원
   * @param {ActionFunctionArgs} args
   */
  async restore(args: ActionFunctionArgs) {
    const response = await this.workspaceService.restore(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 즐겨찾기, 즐겨찾기 해제
   * @param {ActionFunctionArgs} args
   */
  async favorite(args: ActionFunctionArgs) {
    const response = await this.workspaceService.favorite(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    if (!response.data.success) {
      return data(response.data, {
        headers: response.requestInfo.headers,
      });
    }

    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 지원하지 않는 메소드
   * @param {ActionFunctionArgs} args
   */
  noop(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);
    return invariantUnsupportedMethod({
      request: args.request,
      headers: authtication.headers,
    });
  }
}

export const token = WorkspaceController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<WorkspaceController>(token, {
  useClass: WorkspaceController,
});
