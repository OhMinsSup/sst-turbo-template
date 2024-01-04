'server-only';
import { env } from 'env.mjs';
import { CORS_WHITELIST } from '~/constants/constants';

/**
 * Multi purpose CORS lib.
 * Note: Based on the `cors` package in npm but using only
 * web APIs. Feel free to use it in your own projects.
 */
type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

type OriginFn = (
  origin: string | undefined,
  req: Request,
) => StaticOrigin | Promise<StaticOrigin>;

interface CorsOptions {
  origin?: StaticOrigin | OriginFn;
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}

const defaultOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

function isOriginAllowed(origin: string, allowed: StaticOrigin): boolean {
  if (Array.isArray(allowed)) {
    return allowed.some((o) => isOriginAllowed(origin, o));
  }

  if (typeof allowed === 'string') {
    return origin === allowed;
  }

  if (allowed instanceof RegExp) {
    return allowed.test(origin);
  }

  return Boolean(allowed);
}

function getOriginHeaders(reqOrigin: string | undefined, origin: StaticOrigin) {
  const headers = new Headers();

  if (origin === '*') {
    // Allow any origin
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (typeof origin === 'string') {
    // Fixed origin
    headers.set('Access-Control-Allow-Origin', origin);
    headers.append('Vary', 'Origin');
  } else {
    const allowed = isOriginAllowed(reqOrigin ?? '', origin);

    if (allowed && reqOrigin) {
      headers.set('Access-Control-Allow-Origin', reqOrigin);
    }

    headers.append('Vary', 'Origin');
  }

  return headers;
}

async function originHeadersFromReq(
  req: Request,
  origin: StaticOrigin | OriginFn,
) {
  let reqOrigin: string;
  if (req.headers.get('Origin')) {
    reqOrigin = req.headers.get('Origin') as unknown as string;
  } else if (req.headers.get('X-Forwarded-Host')) {
    reqOrigin = `https://${req.headers.get('X-Forwarded-Host')}`;
  } else if (req.headers.get('host')) {
    reqOrigin = `https://${req.headers.get('host')}`;
  } else {
    reqOrigin = env.SITE_URL;
  }

  const value =
    typeof origin === 'function' ? await origin(reqOrigin, req) : origin;
  if (!value) return;
  return getOriginHeaders(reqOrigin, value);
}

function getAllowedHeaders(req: Request, allowed?: string | string[]) {
  const headers = new Headers();

  if (!allowed) {
    const assessControlRequestHeaders = req.headers.get(
      'Access-Control-Request-Headers',
    ) as unknown as string;
    // eslint-disable-next-line no-param-reassign
    allowed = assessControlRequestHeaders;
    headers.append('Vary', 'Access-Control-Request-Headers');
  } else if (Array.isArray(allowed)) {
    // If the allowed headers is an array, turn it into a string
    // eslint-disable-next-line no-param-reassign
    allowed = allowed.join(',');
  }

  if (allowed) {
    headers.set('Access-Control-Allow-Headers', allowed);
  }

  return headers;
}

export const commonOriginFunc = (origin: string | undefined) => {
  const corsWhitelist: RegExp[] = CORS_WHITELIST.ORIGIN;

  if (env.NODE_ENV === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/);
  }

  if (!origin || corsWhitelist.some((regex) => regex.test(origin))) {
    return true;
  }

  return false;
};

export default async function cors(
  req: Request,
  res: Response,
  options?: CorsOptions,
) {
  const opts = { ...defaultOptions, ...options };
  const { headers } = res;
  const originHeaders = await originHeadersFromReq(req, opts.origin ?? false);
  const mergeHeaders = (v: string, k: string) => {
    if (k === 'Vary') headers.append(k, v);
    else headers.set(k, v);
  };

  // If there's no origin we won't touch the response
  if (!originHeaders) return res;

  originHeaders.forEach(mergeHeaders);

  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }

  const exposed = Array.isArray(opts.exposedHeaders)
    ? opts.exposedHeaders.join(',')
    : opts.exposedHeaders;

  if (exposed) {
    headers.set('Access-Control-Expose-Headers', exposed);
  }

  // Handle the preflight request
  if (req.method === 'OPTIONS') {
    if (opts.methods) {
      const methods = Array.isArray(opts.methods)
        ? opts.methods.join(',')
        : opts.methods;

      headers.set('Access-Control-Allow-Methods', methods);
    }

    getAllowedHeaders(req, opts.allowedHeaders).forEach(mergeHeaders);

    if (typeof opts.maxAge === 'number') {
      headers.set('Access-Control-Max-Age', String(opts.maxAge));
    }

    if (opts.preflightContinue) return res;

    headers.set('Content-Length', '0');
    return new Response(null, {
      status: opts.optionsSuccessStatus,
      headers,
    });
  }

  // If we got here, it's a normal request
  return res;
}
