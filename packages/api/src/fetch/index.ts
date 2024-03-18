import { FetchError } from '@template/error';

import type {
  FetchHandlerOptions,
  FetchHandlerResponse,
  MimeTypes,
} from './types';
import {
  encodeMethodCallBody,
  httpResponseBodyParse,
  normalizeHeaders,
  normalizeResponseHeaders,
} from './utils';

const GET_TIMEOUT = 30 * 1000; // 30 seconds
const POST_TIMEOUT = 60 * 1000; // 60 seconds

export async function defaultFetchHandler<
  Mime extends MimeTypes = MimeTypes,
  JsonData = Record<string, undefined>,
>(
  opts: FetchHandlerOptions,
): Promise<
  FetchHandlerResponse<
    Mime extends 'application/json'
      ? JsonData
      : Mime extends 'text/'
        ? string
        : Mime extends 'application/octet-stream'
          ? Blob
          : Response
  >
> {
  const headers = normalizeHeaders(opts.headers);

  const controller = new AbortController();
  const to = setTimeout(
    () => {
      controller.abort();
    },
    opts.method.toLocaleLowerCase() === 'get' ? GET_TIMEOUT : POST_TIMEOUT,
  );

  const reqInit: RequestInit = {
    method: opts.method,
    headers,
    body: encodeMethodCallBody(headers, opts.reqBody),
    signal: controller.signal,
  };

  const request = new Request(opts.uri, reqInit);

  try {
    const res = await fetch(request);
    if (!res.ok) {
      throw new FetchError(res, request, opts);
    }

    const contentType = res.headers.get('content-type') as unknown as Mime;
    const body = await httpResponseBodyParse<Mime, JsonData>(contentType, res);
    return {
      status: res.status,
      headers: normalizeResponseHeaders(res.headers),
      body,
    };
  } finally {
    clearTimeout(to);
  }
}
