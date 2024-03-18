import { BaseError, ErrorType } from '@template/error';

import type { MimeTypes, QueryParams } from './types';

export const getSearchParams = (
  url: URL | string,
  params?: URLSearchParams | string,
): string | URL => {
  if (!params) {
    return url;
  }
  const textSearchParams =
    typeof params === 'string'
      ? params.replace(/^\?/, '')
      : new URLSearchParams(params).toString();
  const searchParams = `?${textSearchParams}`;
  const toStringUrl = typeof url === 'string' ? url : url.toString();
  return toStringUrl.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
};

export function normalizeHeaders(
  headers: Headers | Record<string, string> | undefined,
): Headers | undefined {
  if (typeof headers === 'undefined') {
    return undefined;
  }

  const safyHeaders =
    headers instanceof Headers ? headers : new Headers(headers);
  const normalized: Headers = new Headers();
  const entries = Object.entries(safyHeaders) as [string, string][];

  for (const [header, value] of entries) {
    normalized.set(header.toLowerCase(), value as unknown as string);
  }
  return normalized;
}

export function encodeMethodCallBody<Data = unknown>(
  headers: Headers | undefined,
  data?: Data,
): ArrayBuffer | undefined {
  if (typeof headers === 'undefined') {
    return undefined;
  }

  const contentType = headers.get('content-type');
  if (!contentType || typeof data === 'undefined') {
    return undefined;
  }

  if (data instanceof ArrayBuffer) {
    return data;
  }

  if (contentType.startsWith('text/')) {
    return new TextEncoder().encode((data as string).toString());
  }

  if (contentType.startsWith('application/json')) {
    return new TextEncoder().encode(JSON.stringify(data));
  }

  return undefined;
}

export function normalizeResponseHeaders(
  headers: Headers,
): Record<string, string> {
  // headers.entries() returns an iterator of key, value pairs
  // Object.fromEntries() turns this into an object
  const supportEntries =
    'entries' in headers && typeof headers.entries === 'function';
  if (supportEntries) {
    const safyEntries = headers.entries();
    return Object.fromEntries(safyEntries) as Record<string, string>;
  }

  const normalized: Record<string, string> = {};
  const entries = Object.entries(headers) as [string, string][];
  for (const [header, value] of entries) {
    normalized[header.toLowerCase()] = value as unknown as string;
  }
  return normalized;
}

export async function httpResponseBodyParse<
  Mime extends MimeTypes,
  JsonData = Record<string, unknown>,
>(
  mimeType: Mime,
  res: Response,
): Promise<
  Mime extends 'application/json'
    ? JsonData
    : Mime extends 'text/'
      ? string
      : Mime extends 'application/octet-stream'
        ? Blob
        : Response
> {
  if (mimeType) {
    if (mimeType.includes('application/json')) {
      try {
        const body = (await res.json()) as JsonData;
        return body as Mime extends 'application/json' ? JsonData : never;
      } catch (e) {
        throw new BaseError(
          ErrorType.ResponseError,
          `Failed to parse response body: ${String(e)}`,
        );
      }
    }

    if (mimeType.startsWith('text/')) {
      try {
        const body = await res.text();
        return body as Mime extends 'application/json'
          ? never
          : Mime extends 'text/'
            ? string
            : never;
      } catch (e) {
        throw new BaseError(
          ErrorType.ResponseError,
          `Failed to parse response body: ${String(e)}`,
        );
      }
    }

    if (mimeType.startsWith('application/octet-stream')) {
      try {
        const body = await res.blob();
        return body as Mime extends 'application/json'
          ? never
          : Mime extends 'text/'
            ? never
            : Mime extends 'application/octet-stream'
              ? Blob
              : never;
      } catch (error) {
        throw new BaseError(
          ErrorType.ResponseError,
          `Failed to parse response body: ${String(error)}`,
        );
      }
    }
  }

  return res as Mime extends 'application/json'
    ? never
    : Mime extends 'text/'
      ? never
      : Mime extends 'application/octet-stream'
        ? never
        : Response;
}

export function constructMethodCallUri(
  pathname: string,
  serviceUri: URL,
  params?: QueryParams,
): string {
  const uri = new URL(serviceUri);
  uri.pathname = pathname;

  if (params) {
    const entries = Object.entries(params) as [string, unknown][];
    for (const [key, value] of entries) {
      if (value !== null || typeof value !== 'undefined') {
        if (Array.isArray(value)) {
          uri.searchParams.append(
            key,
            value.map((v) => encodeQueryParam('unknown', v)).join(','),
          );
        } else {
          const hasToString = Object.prototype.hasOwnProperty.call(
            value,
            'toString',
          );

          if (hasToString) {
            const data = value as { toString: () => string };
            uri.searchParams.append(
              key,
              encodeQueryParam('unknown', data.toString()),
            );
          } else {
            uri.searchParams.append(key, encodeQueryParam('unknown', value));
          }
        }
      }
    }
  }

  return uri.toString();
}

export function encodeQueryParam<Value = unknown>(
  type:
    | 'string'
    | 'float'
    | 'integer'
    | 'boolean'
    | 'datetime'
    | 'array'
    | 'unknown',
  value: Value,
): string {
  if (type === 'string' || type === 'unknown') {
    return String(value);
  }
  if (type === 'float') {
    return String(Number(value));
  } else if (type === 'integer') {
    // eslint-disable-next-line no-bitwise -- bitwise operation
    return String(Number(value) | 0);
  } else if (type === 'boolean') {
    return value ? 'true' : 'false';
  } else if (type === 'datetime') {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }
  throw new Error(`Unsupported query param type: ${type}`);
}
