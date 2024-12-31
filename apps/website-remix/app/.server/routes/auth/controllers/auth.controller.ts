import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { container, inject, injectable, singleton } from "tsyringe";

import type { AuthService } from "~/.server/routes/auth/services/auth.service";
import { invariantToastError } from "~/.server/utils/shared";
import { PAGE_ENDPOINTS } from "~/constants/constants";

@singleton()
@injectable()
export class AuthController {
  constructor(
    @inject(AuthController.name)
    private readonly authService: AuthService,
  ) {}

  /**
   * @description 로그인 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signIn(args: ActionFunctionArgs) {
    const response = await this.authService.signIn(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    if (!response.data.success) {
      return response.data;
    }

    return redirect(PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 회원가입 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signUp(args: ActionFunctionArgs) {
    const response = await this.authService.signUp(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    if (!response.data.success) {
      return response.data;
    }

    return redirect(PAGE_ENDPOINTS.PROTECTED.DASHBOARD.ROOT, {
      headers: response.requestInfo.headers,
    });
  }

  /**
   * @description 로그아웃 액션 함수
   * @param {ActionFunctionArgs} args
   */
  async signOut(args: ActionFunctionArgs) {
    const response = await this.authService.signOut(args);
    if (!response.data.success && response.toastMessage) {
      throw invariantToastError(response.toastMessage, response.requestInfo);
    }

    if (!response.data.success) {
      return response.data;
    }

    return redirect(PAGE_ENDPOINTS.AUTH.SIGNIN, {
      headers: response.requestInfo.headers,
    });
  }
}

export const token = AuthController.name;

// 인터페이스와 구현체를 수동으로 등록
container.register<AuthController>(token, {
  useClass: AuthController,
});
