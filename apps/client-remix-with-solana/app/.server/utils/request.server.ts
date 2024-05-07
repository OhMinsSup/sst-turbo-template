import { redirect } from '@remix-run/node';
import { safeRedirect } from 'remix-utils/safe-redirect';

export type SearchParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams
  | undefined;

export function combineHeaders(
  ...headers: Array<ResponseInit['headers'] | null>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

export function combineResponseInits(
  ...responseInits: Array<ResponseInit | undefined>
) {
  let combined: ResponseInit = {};
  for (const responseInit of responseInits) {
    combined = {
      ...responseInit,
      headers: combineHeaders(combined.headers, responseInit?.headers),
    };
  }
  return combined;
}

export function readHeaderCookie(request: Request) {
  const cookie =
    request.headers.get('Cookie') || request.headers.get('Set-Cookie') || null;
  return cookie;
}

export function validateMethods(
  request: Request,
  methods: string[],
  redirectUrl: string,
) {
  const method = request.method;
  const methodLowerCase = method.toLowerCase();
  const checkMethod = methods.some(
    (item) => item.toLowerCase() === methodLowerCase,
  );
  if (!checkMethod) {
    throw redirect(safeRedirect(redirectUrl));
  }
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
  ...headers: Array<ResponseInit['headers'] | null>
) {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      merged.set(key, value);
    }
  }
  return merged;
}
