import { FetchError, BaseError, ErrorType } from '@template/error';
import {
  encodeMethodCallBody,
  httpResponseBodyParse,
  normalizeHeaders,
  normalizeResponseHeaders,
} from './utils';

// types
import type { FetchHandlerOptions, FetchHandlerResponse } from './types';

export async function defaultFetchHandler(
  opts: FetchHandlerOptions,
): Promise<FetchHandlerResponse> {
  const headers = normalizeHeaders(opts.headers);
  const reqInit: RequestInit = {
    method: opts.method,
    headers,
    body: encodeMethodCallBody(headers, opts.reqBody),
  };

  const request = new Request(opts.uri, reqInit);

  try {
    const res = await fetch(request);
    if (!res.ok) {
      throw new FetchError(res, request, opts);
    }

    const contentType = res.headers.get('content-type');
    return {
      status: res.status,
      headers: normalizeResponseHeaders(res.headers),
      body: httpResponseBodyParse(contentType, res),
    };
  } catch (e) {
    if (e instanceof FetchError) {
      throw e;
    }

    throw new BaseError(
      ErrorType.ResponseError,
      `Unexpected error while fetching ${opts.method} ${opts.uri}`,
    );
  }
}
