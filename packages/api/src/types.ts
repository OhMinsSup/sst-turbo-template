import type { MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import type {
  DefaultOpenApiPaths,
  Fetch,
  FetchOptions,
  GlobalApiFetchOptions,
} from "@template/api-fetch";

export interface ApiClientOptions<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
> extends Omit<GlobalApiFetchOptions<Paths, Media>, "AbortController"> {}

export interface ApiPathOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> {
  client: Fetch<Paths, Media>;
  method: Method;
}

export interface ApiConfigOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Media extends MediaType = MediaType,
> {
  client: Fetch<Paths, Media>;
  method: Method;
  path: Path;
}

export interface ApiBuilderOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> {
  client: Fetch<Paths, Media>;
  method: Method;
  path: Path;
  options: FetchOptions<Paths, Method, Path, Init>;
}

export interface SetRetryOptions {
  retry?: number | false;
  maxRetries?: number;
  retryStatusCodes?: number[];
  retryDelay?: number;
}
