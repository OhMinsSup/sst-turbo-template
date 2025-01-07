import type {
  HeadersOptions,
  InitParam,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type { DefaultOpenApiPaths, Fetch } from "@template/api-fetch";

import type { ApiPathOptions } from "./types";
import { ApiConfig } from "./api.config";

export class ApiPath<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> {
  /**
   * @memberof ApiPath
   * @instance
   * @protected
   * @property {Fetch<Paths, Media>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Fetch<Paths, Media>;

  /**
   * @memberof ApiPath
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  constructor(options: ApiPathOptions<Paths, Method, Media>) {
    this.client = options.client;
    this.method = options.method;
  }

  /**
   * @description API 요청을 보낼 때 사용할 path를 설정합니다.
   * @param {Path} path
   * @returns {ApiConfig<Paths, Method, Path>}
   */
  path<
    Path extends PathsWithMethod<Paths, Method>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(path: Path): ApiConfig<Paths, Method, Path, Init, Media> {
    return new ApiConfig<Paths, Method, Path, Init, Media>({
      client: this.client,
      method: this.method,
      path,
    });
  }
}
