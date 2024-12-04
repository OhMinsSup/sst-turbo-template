import type { LoaderFunctionArgs } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { combineHeaders, getRequestInfo } from "@template/utils/request";

import type { Theme } from "~/.server/utils/theme";
import { AuthMiddleware } from "~/.server/middlewares/auth.middleware";
import { auth } from "~/.server/utils/auth";
import { getTheme } from "~/.server/utils/theme";
import { getToast } from "~/.server/utils/toast";
import { getHints } from "~/libs/client-hints";

export interface RequestInfo {
  hints: Record<string, string>;
  origin: string;
  path: string;
  userPrefs: {
    theme: Theme | null;
  };
}

@singleton()
@injectable()
export class RootService {
  constructor(
    @inject(AuthMiddleware.name)
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  /**
   * @descriptionr root 로더 함수
   * @param {LoaderFunctionArgs} args
   */
  async root(args: LoaderFunctionArgs) {
    const toastData = await getToast(args.request);
    const { domainUrl } = getRequestInfo(args.request.headers);
    const authtication = auth.handler(args);

    const requestInfo: RequestInfo = {
      hints: getHints(args.request),
      origin: domainUrl,
      path: new URL(args.request.url).pathname,
      userPrefs: {
        theme: getTheme(args.request),
      },
    };

    return {
      data: {
        requestInfo,
        toast: toastData.toast,
        ...(await this.authMiddleware.getAuth(authtication.authClient)),
      },
      requestInfo: {
        headers: combineHeaders(authtication.headers, toastData.headers),
      },
    } as const;
  }
}

export const token = RootService.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<RootService>(token, {
  useClass: RootService,
});
