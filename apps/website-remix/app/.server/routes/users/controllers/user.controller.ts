import { ActionFunctionArgs, data } from "@remix-run/node";
import { container, inject } from "tsyringe";

import { invariantToastError } from "~/.server/utils/shared";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(
    @inject(UserService.name)
    private readonly userService: UserService,
  ) {}

  /**
   * @description 사용자 정보 변경
   * @param {ActionFunctionArgs} args
   */
  async update(args: ActionFunctionArgs) {
    const response = await this.userService.update(args);
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
}

export const token = UserController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<UserController>(token, {
  useClass: UserController,
});
