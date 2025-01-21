import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { WorkspaceService } from "~/.server/routes/workspaces/services/workspace.service";
import { auth } from "~/.server/utils/auth";
import {
  invariantToastError,
  invariantUnsupportedMethod,
} from "~/.server/utils/shared";
import { FindAllOptions } from "../dto/workspace-list-query.dto";

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
   * @param {FormData?} formData
   */
  async create(args: ActionFunctionArgs, formData?: FormData) {
    const response = await this.workspaceService.create(args, formData);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAll(args: LoaderFunctionArgs, options?: FindAllOptions) {
    const response = await this.workspaceService.findAll(args, options);
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 즐겨찾기한 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByFavorite(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAll(args, {
      isFavorite: true,
    });
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 즐겨찾기한 워크스페이스 리스트 조회 (json fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByFavoriteToJson(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAll(args, {
      isFavorite: true,
    });
    return Response.json(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 삭제된 워크스페이스 리스트 조회 (single fetch)
   * @deprecated
   * @param {LoaderFunctionArgs} args
   */
  async findAllByDeleted(args: LoaderFunctionArgs) {
    const response = await this.workspaceService.findAll(args, {
      isDeleted: true,
    });
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
    const response = await this.workspaceService.findAll(args, {
      isDeleted: true,
    });
    return Response.json(response.data, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 워크스페이스 삭제
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async remove(args: ActionFunctionArgs, formData?: FormData) {
    const response = await this.workspaceService.remove(args, formData);
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
   * @param {FormData?} formData
   */
  async restore(args: ActionFunctionArgs, formData?: FormData) {
    const response = await this.workspaceService.restore(args, formData);
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
   * @param {FormData?} formData
   */
  async favorite(args: ActionFunctionArgs, formData?: FormData) {
    const response = await this.workspaceService.favorite(args, formData);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
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
