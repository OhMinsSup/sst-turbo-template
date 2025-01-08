import type { ClientMethod, MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";
import createClient, { mergeHeaders } from "openapi-fetch";

import type {
  DefaultOpenApiPaths,
  Fetch,
  FetchOptions,
  GlobalApiFetchOptions,
  GlobalFetchOptions,
} from "./types";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
]);

export const networkErrorStatusCodes = new Set([
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

const omitOptions = new Set([
  "retry",
  "retryDelay",
  "retryStatusCodes",
  "maxRetries",
  "timeout",
]);

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"]),
);

export function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}

function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const copy = { ...obj };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}

function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const copy = {} as Pick<T, K>;
  for (const key of keys) {
    copy[key] = obj[key];
  }
  return copy;
}

export function mergedFetchOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
>(
  options: FetchOptions<Paths, Method, Path, Init> | undefined,
  globalOptions: GlobalFetchOptions | undefined,
): {
  options: GlobalFetchOptions;
  init: NonNullable<Init>;
} {
  const headers = mergeHeaders(options?.headers, globalOptions?.headers);

  const init = {
    headers,
    ...omit(
      (options ?? {}) as FetchOptions<Paths, Method, Path, Init>,
      Array.from(omitOptions),
    ),
  };

  return {
    options: {
      ...(globalOptions ?? {}),
      ...pick(
        (options ?? {}) as FetchOptions<Paths, Method, Path, Init>,
        Array.from(omitOptions),
      ),
      headers,
    },
    init: init as NonNullable<Init>,
  };
}

export function getClient<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
>(globalOptions?: GlobalApiFetchOptions<Paths, Media>) {
  return (
    globalOptions?.client ?? createClient<Paths, Media>(globalOptions?.defaults)
  );
}

export function selectedFetchMehtod<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
>(
  fetch: Fetch<Paths, Media>,
  mehtod: Method,
): ClientMethod<Paths, Method, Media> {
  switch (mehtod.toLowerCase()) {
    case "post": {
      return fetch.POST;
    }
    case "put": {
      return fetch.PUT;
    }
    case "delete": {
      return fetch.DELETE;
    }
    case "patch": {
      return fetch.PATCH;
    }
    case "head": {
      return fetch.HEAD;
    }
    case "options": {
      return fetch.OPTIONS;
    }
    case "get":
    default: {
      return fetch.GET;
    }
  }
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
