import type { MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type {
  ApiFetchContext,
  DefaultOpenApiPaths,
  Fetch,
  FetchOptions,
} from "@template/api-fetch";
import { createFetch } from "@template/api-fetch";

import type { ApiBuilderOptions } from "./types";

export class ApiBuilder<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> {
  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {Fetch<Paths, Media>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Fetch<Paths, Media>;

  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {Path} path
   * @description API 요청을 보낼 때 사용할 path
   */
  protected path: Path;

  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {FetchOptions} options
   * @description API 요청을 보낼 때 사용할 options
   */
  protected options: FetchOptions<Paths, Method, Path, Init>;

  constructor(options: ApiBuilderOptions<Paths, Method, Path, Init, Media>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
    this.options = options.options;
  }

  then<
    TResult1 = ApiFetchContext<Paths, Method, Path, Init, Media>,
    TResult2 = never,
  >(
    onfulfilled?:
      | ((
          value: ApiFetchContext<Paths, Method, Path, Init, Media>,
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    const fetchClient = createFetch<Paths, Media>({
      client: this.client,
    });

    const request = {
      path: this.path,
      method: this.method,
    };

    return fetchClient<Method, Path, Init>(request, this.options)
      .then(onfulfilled, onrejected)
      .catch(onrejected);
  }
}
