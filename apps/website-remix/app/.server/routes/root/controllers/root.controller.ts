import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { invariantResponse } from "@epic-web/invariant";
import { container, inject, injectable, singleton } from "tsyringe";

import { RootService } from "~/.server/routes/root/services/root.service";
import { setTheme } from "~/.server/utils/theme";
import { FomrFieldThemeSchema, themeSchema } from "~/libs/theme";

@singleton()
@injectable()
export class RootController {
  constructor(
    @inject(RootService.name) private readonly rootService: RootService,
  ) {}

  /**
   * @description root 컨트롤러
   * @param {LoaderFunctionArgs} args
   */
  async root(args: LoaderFunctionArgs) {
    const response = await this.rootService.root(args);
    return data(response.data, response.requestInfo);
  }

  /**
   * @description empty 컨트롤러
   * @param _
   * @returns
   */
  empty(_: LoaderFunctionArgs) {
    return {};
  }

  /**
   * @description health 컨트롤러
   * @param {LoaderFunctionArgs} args
   */
  async health({ request }: LoaderFunctionArgs) {
    const host =
      request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

    try {
      const url = new URL("/", `http://${host}`);
      await Promise.all([
        fetch(url.toString(), { method: "HEAD" }).then((r) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (!r.ok) return Promise.reject(r);
        }),
      ]);
      return new Response("OK");
    } catch (error: unknown) {
      console.log("healthcheck ❌", { error });
      return new Response("ERROR", { status: 500 });
    }
  }

  /**
   * @description 테마 액션
   * @param {ActionFunctionArgs} args
   */
  async theme(args: ActionFunctionArgs) {
    const formData = await args.request.formData();

    const input = {
      theme: formData.get("theme") as FomrFieldThemeSchema["theme"],
      redirectTo: formData.get(
        "redirectTo",
      ) as FomrFieldThemeSchema["redirectTo"],
    };

    const parsed = themeSchema.safeParse(input);
    invariantResponse(parsed.success, "Invalid theme received");

    const { theme, redirectTo } = parsed.data;

    const responseInit = {
      headers: { "set-cookie": setTheme(theme) },
    };
    if (redirectTo) {
      throw redirect(redirectTo, responseInit);
    } else {
      return data(
        {
          success: true,
        },
        responseInit,
      );
    }
  }
}

export const token = RootController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<RootController>(token, {
  useClass: RootController,
});
