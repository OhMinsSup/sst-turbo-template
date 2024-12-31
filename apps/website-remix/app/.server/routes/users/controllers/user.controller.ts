import { ActionFunctionArgs, data } from "@remix-run/node";
import { container, inject } from "tsyringe";

import { UserService } from "~/.server/routes/users/services/user.service";
import { auth } from "~/.server/utils/auth";
import {
  invariantToastError,
  invariantUnsupportedMethod,
} from "~/.server/utils/shared";

export class UserController {
  constructor(
    @inject(UserService.name)
    private readonly userService: UserService,
  ) {}

  /**
   * @description 사용자 정보 변경
   * @param {ActionFunctionArgs} args
   * @param {FormData?} formData
   */
  async update(args: ActionFunctionArgs, formData?: FormData) {
    const response = await this.userService.update(args, formData);
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

export const token = UserController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<UserController>(token, {
  useClass: UserController,
});
