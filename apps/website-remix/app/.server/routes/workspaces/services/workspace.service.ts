import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { invariant } from "@epic-web/invariant";
import { container, inject, injectable, singleton } from "tsyringe";

import { HttpStatusCode } from "@template/common";

import { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { WorkspaceCreateDto } from "~/.server/routes/workspaces/dto/workspace-create.dto";
import { WorkspaceDeleteDto } from "~/.server/routes/workspaces/dto/workspace-delete.dto";
import { WorkspaceFavoriteDto } from "~/.server/routes/workspaces/dto/workspace-favorite.dto";
import {
  FindAllOptions,
  WorkspaceListQueryDto,
} from "~/.server/routes/workspaces/dto/workspace-list-query.dto";
import { auth } from "~/.server/utils/auth";
import {
  defaultListData,
  defaultToastErrorMessage,
  invariantSession,
} from "~/.server/utils/shared";
import { api } from "~/libs/api";
import { toValidationErrorFormat } from "~/libs/error";

@singleton()
@injectable()
export class WorkspaceService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
    @inject(CacheService.name)
    private readonly cacheService: CacheService,
  ) {}

  /**
   * @description 워크스페이스 생성
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async create(args: ActionFunctionArgs, formData?: FormData) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceCreateDto();
    const body = (await dto.transform(args.request, formData)).json();
    const submitId = dto.submitId();

    try {
      const { response } = await api
        .method("post")
        .path("/api/v1/workspaces")
        .setBody(body)
        .setAuthorization(session.access_token)
        .fetch();

      invariant(response, "response is required");

      const { data, error } = response;

      if (error) {
        const { statusCode, error: innerError } = error;
        switch (statusCode) {
          case HttpStatusCode.BAD_REQUEST: {
            return {
              data: {
                success: false,
                error: toValidationErrorFormat(error),
                submitId: undefined,
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
                submitId: undefined,
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
          submitId,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: null,
      } as const;
    } catch {
      return {
        data: {
          success: false,
          error: null,
          submitId: undefined,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: body,
        toastMessage: defaultToastErrorMessage(
          "워크스페이스를 생성하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }

  /**
   * @description 워크스페이스 즐겨찾기
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async favorite(args: ActionFunctionArgs, formData?: FormData) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceFavoriteDto();
    const dtoInstance = await dto.transform(args.request, formData);
    const body = dtoInstance.json();

    try {
      const { response } = await api
        .method("patch")
        .path("/api/v1/workspaces/{id}/favorite")
        .setBody(body)
        .setParams({
          path: {
            id: dtoInstance.id,
          },
        })
        .setAuthorization(session.access_token)
        .fetch();

      invariant(response, "response is required");

      const { data, error } = response;
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
    } catch {
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
        toastMessage: defaultToastErrorMessage(
          "즐겨찾기를 변경하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }

  /**
   * @description 워크스페이스 목록 조회
   * @param {LoaderFunctionArgs} args
   * @param {FindAllOptions} options
   */
  async findAll(args: LoaderFunctionArgs, options: FindAllOptions = {}) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceListQueryDto(options);
    const query = dto.transform(args.request).json();

    try {
      const { response } = await api
        .method("get")
        .path(
          options.isDeleted
            ? "/api/v1/workspaces/deleted"
            : "/api/v1/workspaces",
        )
        .setAuthorization(session.access_token)
        .setParams({
          query,
        })
        .fetch();

      invariant(response, "response is required");

      // 에러가 존재하면 에러를 반환합니다.
      invariant(!response.error, "response.error is required");

      const { data } = response;

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
      } as const;
    } catch {
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
      } as const;
    }
  }

  /**
   * @description 워크스페이스 삭제
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async remove(args: ActionFunctionArgs, formData?: FormData) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceDeleteDto();
    const dtoInstance = await dto.transform(args.request, formData);

    try {
      const { response } = await api
        .method("delete")
        .path("/api/v1/workspaces/{id}")
        .setParams({
          path: {
            id: dtoInstance.id,
          },
        })
        .setAuthorization(session.access_token)
        .fetch();

      invariant(response, "response is required");

      const { data, error } = response;
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
          workspace: data.data,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: null,
      };
    } catch {
      return {
        data: {
          success: false,
          error: null,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: defaultToastErrorMessage(
          "워크스페이스를 삭제하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }

  /**
   * @description 워크스페이스 복구
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async restore(args: ActionFunctionArgs, formData?: FormData) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WorkspaceDeleteDto();
    const dtoInstance = await dto.transform(args.request, formData);

    try {
      const { response } = await api
        .method("patch")
        .path("/api/v1/workspaces/{id}/restore")
        .setParams({
          path: {
            id: dtoInstance.id,
          },
        })
        .setAuthorization(session.access_token)
        .fetch();

      invariant(response, "response is required");

      const { data, error } = response;
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
          workspace: data.data,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: null,
      };
    } catch {
      return {
        data: {
          success: false,
          error: null,
        },
        requestInfo: {
          headers: authtication.headers,
          request: args.request,
        },
        requestBody: null,
        toastMessage: defaultToastErrorMessage(
          "워크스페이스를 복구하는 중에 오류가 발생했습니다.",
        ),
      } as const;
    }
  }
}

export const token = WorkspaceService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<WorkspaceService>(token, {
  useClass: WorkspaceService,
});
