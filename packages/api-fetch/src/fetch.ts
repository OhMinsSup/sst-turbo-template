import type { MaybeOptionalInit } from "openapi-fetch";
import type {
  HttpMethod,
  MediaType,
  PathsWithMethod,
} from "openapi-typescript-helpers";

import { createBaseError } from "@template/common";

import type {
  ApiFetchContext,
  DefaultOpenApiPaths,
  FetchOptions,
  FetchRequestInit,
  GlobalApiFetchOptions,
} from "./types";
import { polyfillGlobalThis } from "./polyfills";
import {
  getClient,
  isPayloadMethod,
  mergedFetchOptions,
  networkErrorStatusCodes,
  retryStatusCodes,
  selectedFetchMehtod,
  sleep,
} from "./utils";

// 전역 객체에 대한 폴리필을 적용합니다.
polyfillGlobalThis();

export function createFetch<
  Paths extends DefaultOpenApiPaths,
  Media extends MediaType = MediaType,
>(globalOptions: GlobalApiFetchOptions<Paths, Media> = {}) {
  const { AbortController = globalThis.AbortController, defaults } =
    globalOptions;

  const client = getClient<Paths, Media>(globalOptions);

  async function onError<
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(
    context: ApiFetchContext<Paths, Method, Path, Init, Media>,
  ): Promise<ApiFetchContext<Paths, Method, Path, Init, Media>> {
    if (
      context.response &&
      networkErrorStatusCodes.has(context.response.response.status)
    ) {
      const error = createBaseError({
        message: "[FetchError]: A network error occurred",
        name: "FetchError",
        data: context,
      });
      context.error = error;
      throw error;
    }

    // Is Abort
    // If it is an active abort, it will not retry automatically.
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names
    const isAbort =
      (context.error &&
        context.error.name === "AbortError" &&
        !context.options.timeout) ??
      false;

    // Retry
    if (context.options.retry !== false && !isAbort) {
      let retries: number;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }

      const responseCode = context.response?.response.status ?? 500;

      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        const maxRetries = context.options.maxRetries ?? 5;
        let retryDelay = context.options.retryDelay ?? 1000;
        if (typeof retryDelay === "function") {
          retryDelay = retryDelay(retries);
        } else {
          // backoff
          retryDelay = retryDelay * Math.pow(2, maxRetries - retries);
        }
        await sleep(retryDelay);
        context.options.retry = retries - 1;
        return await $fetchClient(context.request, context.init);
      }
    }

    return context;
  }

  const $fetchClient = async function fetchClient<
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(
    request: FetchRequestInit<Paths, Method, Path>,
    options: FetchOptions<Paths, Method, Path, Init>,
  ): Promise<ApiFetchContext<Paths, Method, Path, Init, Media>> {
    const context: ApiFetchContext<Paths, Method, Path, Init, Media> = {
      request,
      ...mergedFetchOptions<Paths, Method, Path, Init>(options, defaults),
    };

    let abortTimeout: NodeJS.Timeout | undefined;
    if (!context.init.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = createBaseError({
          message: "[TimeoutError]: The operation was aborted due to timeout",
          name: "TimeoutError",
          code: 23, // DOMException.TIMEOUT_ERR
          data: context,
        });
        controller.abort(error);
      }, context.options.timeout);

      context.init.signal = controller.signal;
    }

    const fetchClient = selectedFetchMehtod<Paths, Method, Media>(
      client,
      context.request.method,
    );

    try {
      context.response = await fetchClient(context.request.path, context.init);
    } catch (e) {
      context.error = e as Error;
      const error = createBaseError({
        message: "[FetchError]: A fetch error occurred",
        name: "FetchError",
        data: context,
      });
      throw error;
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }

    const error = context.response.error;
    const status = context.response.response.status;
    if (error && status >= 400 && status < 600) {
      return await onError(context);
    }

    return context;
  };

  return $fetchClient;
}
