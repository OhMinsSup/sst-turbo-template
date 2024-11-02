import type { Client, InitParam, MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type { ApiConfigOptions } from "./types";
import { ApiBuilder } from "./api.builder";

export class ApiConfig<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
> {
  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {Client<Paths>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Client<Paths, MediaType>;

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {Path} path
   * @description API 요청을 보낼 때 사용할 path
   */
  protected path: Path;

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {Headers?} headers
   * @description API 요청을 보낼 때 사용할 headers
   */
  protected headers?: Headers;

  constructor(options: ApiConfigOptions<Paths, Method, Path>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
  }

  /**
   * @description API 요청을 보낼 때 사용할 headers를 설정합니다. 기존 headers가 있을 경우 덮어씁니다.
   * 그리고 이 메소드는 인증토큰을 설정할 때 사용할 수 있습니다.
   * @param {string} token
   * @param {"Bearer" | "Basic"} type
   * @returns {this}
   */
  setAuthorization(token: string, type: "Bearer" | "Basic" = "Bearer"): this {
    if (!this.headers) {
      this.headers = new Headers();
    }
    this.headers.set("Authorization", `${type} ${token}`);
    return this;
  }

  /**
   * @description 해당 함수를 요청하면 PromiseLike 객체를 반환합니다.
   * @param {InitParam<Init>} init
   * @returns {ApiBuilder<Paths, Method, Path, Init>}
   */
  run<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    ...init: InitParam<Init>
  ): ApiBuilder<Paths, Method, Path, Init> {
    return new ApiBuilder<Paths, Method, Path, Init>({
      client: this.client,
      path: this.path,
      method: this.method,
      requestInit: init,
      headers: this.headers,
    });
  }
}
