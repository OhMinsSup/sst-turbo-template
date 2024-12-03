import type {
  Client,
  HeadersOptions,
  InitParam,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import { isNullOrUndefined } from "@template/utils/assertion";

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
   * @property {HeadersOptions?} headers
   * @description API 요청을 보낼 때 사용할 headers
   */
  protected headers?: HeadersOptions;

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {NonNullable<InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]>["bodySerializer"];?} bodySerializer
   * @description API 요청을 보낼 때 사용할 body serializer
   */
  protected bodySerializer?: NonNullable<
    InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]
  >["bodySerializer"];

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {NonNullable<InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]>["querySerializer"]?} querySerializer
   * @description API 요청을 보낼 때 사용할 query serializer
   */
  protected querySerializer?: NonNullable<
    InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]
  >["querySerializer"];

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {NonNullable<InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]>["params"];?} params
   * @description API 요청을 보낼 때 사용할 params
   */
  protected params?: NonNullable<
    InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]
  >["params"];

  /**
   * @memberof ApiConfig
   * @instance
   * @protected
   * @property {NonNullable<InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]>["body"];?} body
   * @description API 요청을 보낼 때 사용할 body
   */
  protected body?: NonNullable<
    InitParam<MaybeOptionalInit<Paths[Path], Method>>[0]
  >["body"];

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
    const newHeaders = new Headers();
    newHeaders.set("Authorization", `${type} ${token}`);

    if (this.headers) {
      if (this.headers instanceof Headers) {
        for (const [key, value] of newHeaders.entries()) {
          this.headers.set(key, value);
        }
      } else if (typeof this.headers === "object") {
        this.headers = {
          ...this.headers,
          ...Object.fromEntries(newHeaders.entries()),
        };
      }
    } else {
      this.headers = newHeaders;
    }

    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 headers를 설정합니다. 기존 headers가 있을 경우 덮어씁니다.
   * @param {HeadersOptions} headers
   * @returns {this}
   */
  setHeaders(headers: HeadersOptions): this {
    if (headers instanceof Headers) {
      this.headers = headers;
    } else {
      const newHeaders = new Headers();
      Object.entries(headers).forEach(([key, value]) => {
        if (!isNullOrUndefined(value)) {
          if (typeof value === "number" || typeof value === "boolean") {
            newHeaders.set(key, value.toString());
          } else if (typeof value === "string") {
            newHeaders.set(key, value);
          } else {
            newHeaders.set(key, JSON.stringify(value));
          }
        }
      });
      this.headers = newHeaders;
    }
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 Params를 설정합니다.
   * @param {NonNullable<InitParam<Init>[0]>["params"]} params
   * @returns {this}
   */
  setParams<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    params: NonNullable<InitParam<Init>[0]>["params"],
  ): this {
    this.params = params;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 body를 설정합니다.
   * @param {NonNullable<InitParam<Init>[0]>["body"]} body
   * @returns {this}
   */
  setBody<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    body: NonNullable<InitParam<Init>[0]>["body"],
  ): this {
    this.body = body;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 BodySerializer를 설정합니다.
   * @param {NonNullable<InitParam<Init>[0]>["bodySerializer"]} bodySerializer
   * @returns {this}
   */
  setBodySerializer<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    bodySerializer: NonNullable<InitParam<Init>[0]>["bodySerializer"],
  ): this {
    this.bodySerializer = bodySerializer;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 querySerializer를 설정합니다.
   * @param {NonNullable<InitParam<Init>[0]>["querySerializer"]} querySerializer
   * @returns {this}
   */
  setQuerySerializer<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    querySerializer: NonNullable<InitParam<Init>[0]>["querySerializer"],
  ): this {
    this.querySerializer = querySerializer;
    return this;
  }

  /**
   * @description 해당 함수를 요청하면 PromiseLike 객체를 반환합니다.
   * @returns {ApiBuilder<Paths, Method, Path, Init>}
   */
  run<Init extends MaybeOptionalInit<Paths[Path], Method>>(): ApiBuilder<
    Paths,
    Method,
    Path,
    Init
  > {
    return new ApiBuilder<Paths, Method, Path, Init>({
      client: this.client,
      path: this.path,
      method: this.method,
      // @ts-expect-error init is not assignable to type 'InitParam<Init>'
      requestInit: {
        headers: this.headers,
        body: this.body,
        bodySerializer: this.bodySerializer,
        querySerializer: this.querySerializer,
        params: this.params,
      },
    });
  }
}
