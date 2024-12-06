import type { LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import { WidgetService } from "~/.server/routes/widgets/services/widget.service";

@singleton()
@injectable()
export class WidgetController {
  constructor(
    @inject(WidgetService.name)
    private readonly widgetService: WidgetService,
  ) {}

  /**
   * @description 워크스페이스 리스트 조회 (single fetch)
   * @param {LoaderFunctionArgs} args
   */
  async findAllByWidgetWorkspace(args: LoaderFunctionArgs) {
    const response = await this.widgetService.findAllByWidgetWorkspace(args);
    return data(response.data, {
      headers: response.requestInfo.headers,
    });
  }
}

export const token = WidgetController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<WidgetController>(token, {
  useClass: WidgetController,
});
