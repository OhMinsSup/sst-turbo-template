import type { Client, ClientOptions, Middleware } from "openapi-fetch";
import type { HttpMethod } from "openapi-typescript-helpers";
import createClient, { removeTrailingSlash } from "openapi-fetch";

import type { ApiClientOptions } from "./types";
import { ApiPath } from "./api.path";

export class ApiClient<Paths extends {}> {
  protected client: Client<Paths>;

  protected baseUrl?: string;

  protected querySerializer?: ClientOptions["querySerializer"];

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

  method<Method extends HttpMethod>(method: Method) {
    return new ApiPath<Paths, Method>({
      client: this.client,
      method,
    });
  }

  use(...middlewares: Middleware[]) {
    this.client.use(...middlewares);
    return this;
  }

  eject(...middlewares: Middleware[]) {
    this.client.eject(...middlewares);
    return this;
  }
}
