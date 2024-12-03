import type { Client } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type { ApiPathOptions } from "./types";
import { ApiConfig } from "./api.config";

export class ApiPath<Paths extends {}, Method extends HttpMethod> {
  /**
   * @memberof ApiPath
   * @instance
   * @protected
   * @property {Client<Paths>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Client<Paths, MediaType>;

  /**
   * @memberof ApiPath
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  constructor(options: ApiPathOptions<Paths, Method>) {
    this.client = options.client;
    this.method = options.method;
  }

  /**
   * @description API 요청을 보낼 때 사용할 path를 설정합니다.
   * @param {Path} path
   * @returns {ApiConfig<Paths, Method, Path>}
   */
  path<Path extends PathsWithMethod<Paths, Method>>(
    path: Path,
  ): ApiConfig<Paths, Method, Path> {
    return new ApiConfig<Paths, Method, Path>({
      client: this.client,
      method: this.method,
      path,
    });
  }
}
