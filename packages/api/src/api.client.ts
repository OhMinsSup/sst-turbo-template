import type { Client, ClientOptions, Middleware } from "openapi-fetch";
import type { HttpMethod } from "openapi-typescript-helpers";
import createClient, { removeTrailingSlash } from "openapi-fetch";

import type { ApiClientOptions } from "./types";
import { ApiPath } from "./api.path";

export class ApiClient<Paths extends {}> {
  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {Client<Paths>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Client<Paths>;

  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {string?} baseUrl
   * @description API 요청을 보낼 때 사용할 기본 URL
   */
  protected baseUrl?: string;

  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {ClientOptions["querySerializer"]?} querySerializer
   * @description API 요청을 보낼 때 사용할 query serializer
   */
  protected querySerializer?: ClientOptions["querySerializer"];

  /**
   * @memberof ApiClient
   * @instance
   * @protected
   * @property {ClientOptions["bodySerializer"]?} bodySerializer
   * @description API 요청을 보낼 때 사용할 body serializer
   */
  protected bodySerializer?: ClientOptions["bodySerializer"];

  constructor(options: ApiClientOptions<Paths> = {}) {
    if (options.client) {
      this.client = options.client;
    } else {
      if (options.baseUrl) {
        this.baseUrl = removeTrailingSlash(options.baseUrl);
      }

      if (
        options.querySerializer &&
        typeof options.querySerializer === "function"
      ) {
        this.querySerializer = options.querySerializer;
      }

      if (
        options.bodySerializer &&
        typeof options.bodySerializer === "function"
      ) {
        this.bodySerializer = options.bodySerializer;
      }

      this.client = createClient<Paths>({
        baseUrl: this.baseUrl,
        querySerializer: this.querySerializer,
        bodySerializer: this.bodySerializer,
      });
    }

    if (options.middlewares) {
      this.client.use(...options.middlewares);
    }
  }

  /**
   * @description API 요청을 보낼 method를 지정합니다. method에 따라 요청이 가능한 API Path를 반환합니다.
   * @param {HttpMethod} method
   * @returns {ApiPath<Paths, Method>}
   */
  method<Method extends HttpMethod>(method: Method): ApiPath<Paths, Method> {
    return new ApiPath<Paths, Method>({
      client: this.client,
      method,
    });
  }

  /**
   * @description API 요청을 보낼 때 사용할 middleware를 추가합니다.
   * @param {Middleware[]} middlewares
   * @returns {this}
   */
  use(...middlewares: Middleware[]): this {
    this.client.use(...middlewares);
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 middleware를 제거합니다.
   * @param {Middleware[]} middlewares
   * @returns {this}
   */
  eject(...middlewares: Middleware[]): this {
    this.client.eject(...middlewares);
    return this;
  }
}
