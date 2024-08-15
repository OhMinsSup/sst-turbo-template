/**
 * Convert headers to an array of key-value pairs
 */
export function headersToEntries(headers: Headers): [string, string][] {
  const entries: [string, string][] = [];
  headers.forEach((value, key) => {
    entries.push([key, value]);
  });
  return entries;
}

/**
 * Convert headers to an object
 */
export function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
): Headers {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of headersToEntries(new Headers(header))) {
      merged.set(key, value);
    }
  }
  return merged;
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
): Headers {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of headersToEntries(new Headers(header))) {
      combined.append(key, value);
    }
  }
  return combined;
}

/**
 * Combine multiple response init objects into one (uses combineHeaders)
 */
export function combineResponseInits(
  ...responseInits: (ResponseInit | null | undefined)[]
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

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  const protocol = request.headers.get("X-Forwarded-Proto") ?? "http";
  return `${protocol}://${host}`;
}

export function getRequestInfo(headers: Headers | Readonly<Headers>) {
  const host =
    headers.get("X-Forwarded-Host") ??
    headers.get("Origin") ??
    headers.get("host");

  if (!host) {
    throw new Error("Could not determine domain URL.");
  }

  const isLocalhost = host.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";
  return {
    host,
    protocol,
    isLocalhost,
    domainUrl: `${protocol}://${host}`,
  };
}
