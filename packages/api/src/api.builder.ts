import type {
  Client,
  FetchResponse,
  InitParam,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type { ApiBuilderOptions } from "./types";

export class ApiBuilder<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
> {
  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {Client<Paths, MediaType>} client
   * @description openapi-fetch의 Client 인스턴스
   */
  protected client: Client<Paths, MediaType>;

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
   * @property {InitParam<Init>?} requestInit
   * @description API 요청을 보낼 때 사용할 request init
   */
  protected requestInit?: InitParam<Init>;

  /**
   * @memberof ApiBuilder
   * @instance
   * @protected
   * @property {Headers?} headers
   * @description API 요청을 보낼 때 사용할 headers
   */
  protected headers?: Headers;

  constructor(options: ApiBuilderOptions<Paths, Method, Path, Init>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
    this.requestInit = options.requestInit;
    this.headers = options.headers;
  }

  then<
    TResult1 = FetchResponse<Paths[Path][Method], Init, MediaType>,
    TResult2 = never,
  >(
    onfulfilled?:
      | ((
          value: FetchResponse<Paths[Path][Method], Init, MediaType>,
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    const fnKey = this.method.toUpperCase() as keyof Omit<
      Client<Paths, MediaType>,
      "use" | "eject"
    >;
    const fetcher = this.client[fnKey];

    // @ts-expect-error - openapi-fetch에서는 메소드마다 다른 함수를 호출해야하는데 통일하기 위해 이렇게 작성했습니다.
    return fetcher(this.path, {
      headers: this.headers,
      ...this.requestInit,
    })
      .then(onfulfilled, onrejected)
      .catch(onrejected);
  }
}
