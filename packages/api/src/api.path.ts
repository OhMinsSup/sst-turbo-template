import type { Client } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type { ApiPathOptions } from "./types";
import { ApiConfig } from "./api.config";

export class ApiPath<Paths extends {}, Method extends HttpMethod> {
  protected client: Client<Paths, MediaType>;

  protected method: Method;

  constructor(options: ApiPathOptions<Paths, Method>) {
    this.client = options.client;
    this.method = options.method;
  }

  path<Path extends PathsWithMethod<Paths, Method>>(path: Path) {
    return new ApiConfig<Paths, Method, Path>({
      client: this.client,
      method: this.method,
      path,
    });
  }
}
