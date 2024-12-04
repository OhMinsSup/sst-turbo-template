import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { HttpStatusCode } from "@template/common";

// import type { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { WorkspaceCreateDto } from "~/.server/routes/workspaces/dto/workspace-create.dto";
import { WorkspaceFavoriteDto } from "~/.server/routes/workspaces/dto/workspace-favorite.dto";
import { WorkspaceListQueryDto } from "~/.server/routes/workspaces/dto/workspace-list-query.dto";
import { auth } from "~/.server/utils/auth";
import {
  defaultListData,
  defaultToastErrorMessage,
  invariantSession,
} from "~/.server/utils/shared";
import { api } from "~/libs/api";
import { toValidationErrorFormat } from "~/libs/error";
import { WorkspaceDeleteDto } from "../dto/workspace-delete.dto";

@singleton()
@injectable()
export class WorkspaceService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
    // private readonly cacheService: CacheService,
  ) {}

  /**
   * @description 워크스페이스 생성
   * @param {ActionFunctionArgs} args
   */
  async create(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceCreateDto();
    const body = (await dto.transform(args.request)).json();

    const { data, error } = await api
      .method("post")
      .path("/api/v1/workspaces")
      .setBody(body)
      .setAuthorization(session.access_token)
      .run();

    if (error) {
      const { statusCode, error: innerError } = error;
      switch (statusCode) {
        case HttpStatusCode.BAD_REQUEST: {
          return {
            data: {
              success: false,
              error: toValidationErrorFormat(error),
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: null,
          } as const;
        }
        default: {
          return {
            data: {
              success: false,
              error: null,
            },
            requestInfo: {
              headers: authtication.headers,
              request: args.request,
            },
            requestBody: body,
            toastMessage: defaultToastErrorMessage(innerError.message),
          } as const;
        }
      }
    }

    return {
      data: {
        success: true,
        workspace: data.data,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: body,
      toastMessage: null,
    } as const;
  }

  /**
   * @description 워크스페이스 즐겨찾기
   * @param {ActionFunctionArgs} args
   */
  async favorite(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceFavoriteDto();
    const dtoInstance = await dto.transform(args.request);
    const body = dtoInstance.json();

    const { data, error } = await api
      .method("patch")
      .path("/api/v1/workspaces/{id}/favorite")
      .setBody(body)
      .setParams({
        path: {
          id: dtoInstance.id,
        },
      })
      .setAuthorization(session.access_token)
      .run();

    if (error) {
      const { error: innerError } = error;
      return {
        data: {
          success: false,
          error: null,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: defaultToastErrorMessage(innerError.message),
      } as const;
    }

    return {
      data: {
        success: true,
        workspace: data.data,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: body,
      toastMessage: null,
    } as const;
  }

  /**
   * @description 워크스페이스 목록 조회
   * @param {LoaderFunctionArgs} args
   */
  async findAll(args: LoaderFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceListQueryDto();
    const query = dto.transform(args.request).json();

    const { data, error } = await api
      .method("get")
      .path("/api/v1/workspaces")
      .setAuthorization(session.access_token)
      .setParams({
        query,
      })
      .run();

    if (error) {
      return {
        data: {
          success: false,
          ...defaultListData(),
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        requestQuery: query,
        toastMessage: null,
      };
    }

    return {
      data: {
        success: true,
        ...data.data,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: null,
      requestQuery: query,
      toastMessage: null,
    };
  }

  /**
   * @description 워크스페이스 삭제
   * @param {ActionFunctionArgs} args
   */
  async remove(args: ActionFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceDeleteDto();
    const dtoInstance = await dto.transform(args.request);

    const { data, error } = await api
      .method("delete")
      .path("/api/v1/workspaces/{id}")
      .setParams({
        path: {
          id: dtoInstance.id,
        },
      })
      .setAuthorization(session.access_token)
      .run();

    if (error) {
      const { error: innerError } = error;
      return {
        data: {
          success: false,
          error,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: defaultToastErrorMessage(innerError.message),
      } as const;
    }

    return {
      data: {
        success: true,
        data,
      },
      requestInfo: {
        headers: authtication.headers,
        request: args.request,
      },
      requestBody: null,
      toastMessage: null,
    };
  }
}

export const token = WorkspaceService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<WorkspaceService>(token, {
  useClass: WorkspaceService,
});
