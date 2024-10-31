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
  protected client: Client<Paths, MediaType>;

  protected path: Path;

  protected method: Method;

  protected headers?: Headers;

  constructor(options: ApiConfigOptions<Paths, Method, Path>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
  }

  setAuthorization(token: string, type: "Bearer" | "Basic" = "Bearer") {
    if (!this.headers) {
      this.headers = new Headers();
    }
    this.headers.set("Authorization", `${type} ${token}`);
    return this;
  }

  run<Init extends MaybeOptionalInit<Paths[Path], Method>>(
    ...init: InitParam<Init>
  ) {
    return new ApiBuilder<Paths, Method, Path, Init>({
      client: this.client,
      path: this.path,
      method: this.method,
      requestInit: init,
      headers: this.headers,
    });
  }
}
