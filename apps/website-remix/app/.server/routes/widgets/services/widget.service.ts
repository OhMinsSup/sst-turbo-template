import type { LoaderFunctionArgs } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { CacheService } from "~/.server/cache/cache.service";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { WidgetWorkspaceListQueryDto } from "~/.server/routes/widgets/dto/widget-workspace-list-query.dto";
import { auth } from "~/.server/utils/auth";
import {
  defaultWidgetWorkspaceListData,
  invariantSession,
} from "~/.server/utils/shared";
import { api } from "~/libs/api";

@singleton()
@injectable()
export class WidgetService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
    @inject(CacheService.name)
    private readonly cacheService: CacheService,
  ) {}

  /**
   * @description 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByWidgetWorkspace(args: LoaderFunctionArgs) {
    const authtication = auth.handler(args);
    const { session } = await this.authMiddleware.getSession(
      authtication.authClient,
    );

    invariantSession(session, {
      request: args.request,
      headers: authtication.headers,
    });

    const dto = new WidgetWorkspaceListQueryDto();
    const query = dto.transform(args.request).json();

    const { data, error } = await api
      .method("get")
      .path("/api/v1/widgets/workspaces")
      .setAuthorization(session.access_token)
      .setParams({
        query,
      })
      .run();

    if (error) {
      return {
        data: {
          success: false,
          ...defaultWidgetWorkspaceListData(),
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
}

export const token = WidgetService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<WidgetService>(token, {
  useClass: WidgetService,
});
