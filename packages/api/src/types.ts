import type {
  Client,
  ClientOptions,
  InitParam,
  MaybeOptionalInit,
  Middleware,
} from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

export interface ApiClientOptions<Paths extends {}> {
  baseUrl?: string;
  client?: Client<Paths, MediaType>;
  middlewares?: Middleware[];
  /** global querySerializer */
  querySerializer?: ClientOptions["querySerializer"];
  /** global bodySerializer */
  bodySerializer?: ClientOptions["bodySerializer"];
}

export interface ApiPathOptions<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
> {
  client: Client<Paths, MediaType>;
  method: Method;
}

export interface ApiConfigOptions<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
> {
  client: Client<Paths, MediaType>;
  method: Method;
  path: Path;
}

export interface ApiBuilderOptions<
  Paths extends Record<string, Record<HttpMethod, {}>>,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
> {
  client: Client<Paths, MediaType>;
  method: Method;
  path: Path;
  requestInit?: InitParam<Init>;
  headers?: Headers;
}
