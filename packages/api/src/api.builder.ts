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
  protected client: Client<Paths, MediaType>;

  protected path: Path;

  protected method: Method;

  protected requestInit?: InitParam<Init>;

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
