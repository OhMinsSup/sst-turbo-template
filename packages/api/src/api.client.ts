import type { HttpMethod, MediaType } from "openapi-typescript-helpers";
import createClient, { removeTrailingSlash } from "openapi-fetch";

import type { DefaultOpenApiPaths, Fetch } from "@template/api-fetch";

import type { ApiClientOptions } from "./types";
import { ApiPath } from "./api.path";

export class ApiClient<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
> {
  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {Fetch<Paths, Media>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Fetch<Paths, Media>;

  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {string?} baseUrl
   * @description API 요청을 보낼 때 사용할 기본 URL
   */
  protected baseUrl?: string;

  constructor(
    options: ApiClientOptions<Paths, Media> = {
      defaults: {},
    },
  ) {
    if (options.client) {
      this.client = options.client;
    } else {
      if (options.defaults?.baseUrl) {
        this.baseUrl = removeTrailingSlash(options.defaults.baseUrl);
      }
      this.client = createClient<Paths, Media>({
        ...options.defaults,
        baseUrl: this.baseUrl,
      });
    }
  }

  /**
   * @description API 요청을 보낼 method를 지정합니다. method에 따라 요청이 가능한 API Path를 반환합니다.
   * @param {HttpMethod} method
   * @returns {ApiPath<Paths, Method, Media>}
   */
  method<Method extends HttpMethod>(
    method: Method,
  ): ApiPath<Paths, Method, Media> {
    return new ApiPath<Paths, Method, Media>({
      client: this.client,
      method,
    });
  }
}
