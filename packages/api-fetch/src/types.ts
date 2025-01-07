import type {
  Client,
  ClientOptions,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
import type {
  ErrorResponse,
  HttpMethod,
  MediaType,
  PathsWithMethod,
  ResponseObjectMap,
} from "openapi-typescript-helpers";

import type { BaseError, HttpError } from "@template/common";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultOpenApiPaths = Record<string, any>;

export type Fetch<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
> = Client<Paths, Media>;

export type DefaultFetchOptions = ExpandedFetchOptions &
  Record<string, unknown>;

export type GlobalFetchOptions = ClientOptions & ExpandedFetchOptions;

export type FetchOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
> = DefaultFetchOptions & Init;

export interface ExpandedFetchOptions {
  retry?: number | false;

  maxRetries?: number;

  /** Delay between retries in milliseconds. */
  retryDelay?: number | ((retries: number) => number);

  /** Default is [408, 409, 425, 429, 500, 502, 503, 504] */
  retryStatusCodes?: number[];

  /** timeout in milliseconds */
  timeout?: number;
}

export interface GlobalApiFetchOptions<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
> {
  client?: Fetch<Paths, Media>;
  defaults?: GlobalFetchOptions;
  AbortController?: typeof AbortController;
}

export interface FetchRequestInit<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
> {
  path: Path;
  method: Method;
}

export interface ApiFetchContext<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> {
  request: FetchRequestInit<Paths, Method, Path>;
  options: GlobalFetchOptions;
  init: NonNullable<Init>;
  response?: FetchResponse<Paths[Path][Method], Init, Media>;
  error?:
    | HttpError<ErrorResponse<ResponseObjectMap<Paths[Path][Method]>, Media>>
    | BaseError;
}
