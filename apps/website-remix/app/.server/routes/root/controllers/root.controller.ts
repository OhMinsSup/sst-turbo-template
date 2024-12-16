import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { RootService } from "~/.server/routes/root/services/root.service";

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
}

export const token = RootController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<RootController>(token, {
  useClass: RootController,
});
