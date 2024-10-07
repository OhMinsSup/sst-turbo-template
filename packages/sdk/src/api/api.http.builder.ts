import type { $Fetch } from "ofetch";

import type {
  $OfetchOptions,
  ApiParams,
  FnNameKey,
  HeadersInit,
  MethodType,
  TransformBuilderConstructorOptions,
} from "./types";
import { ApiInputBuilder } from "./api.input.builder";

export class ApiHttpBuilder<FnKey extends FnNameKey = FnNameKey> {
  protected fnKey: FnKey;

  protected url: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected signal?: AbortSignal;

  protected path?: ApiParams<FnKey, MethodType>;

  protected method?: MethodType;

  constructor(transform: TransformBuilderConstructorOptions<FnKey>) {
    this.fnKey = transform.fnKey;
    this.url = transform.url;
    this.fetchClient = transform.fetchClient;
    if (transform.signal) {
      this.signal = transform.signal;
    }
    if (transform.options) {
      this.options = transform.options;
    }
    if (transform.headers) {
      this.headers = transform.headers;
    }
  }

  /**
   * @description Set the authorization token.
   * @param {string} token
   * @param {"Bearer" | "Basic"} type
   */
  setAuthToken(token: string, type: "Bearer" | "Basic" = "Bearer") {
    const _cloneHeaders = new Headers(this.headers);
    _cloneHeaders.set("Authorization", `${type} ${token}`);
    this.headers = _cloneHeaders;
    return this;
  }

  /**
   * @description Set the headers.
   * @param {HeadersInit} headers
   * @param {"set" | "append" | "delete"} type
   */
  setHeaders(
    headers: HeadersInit | Record<string, unknown>,
    type: "set" | "append" | "delete" = "set",
  ) {
    const _cloneHeaders = new Headers(this.headers);
    if (headers instanceof Headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
          _cloneHeaders[type](key, value);
        }
        if (Array.isArray(value)) {
          _cloneHeaders[type](key, value.join(","));
        }
      }
    } else if (Array.isArray(headers)) {
      for (const header of headers) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (Array.isArray(header) && header.length === 2) {
          const [key, value] = header;
          if (key && value) {
            _cloneHeaders[type](key, value);
          }
        }
      }
    } else if (typeof headers === "object") {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
          _cloneHeaders[type](key, value);
        }
        if (Array.isArray(value)) {
          _cloneHeaders[type](key, value.join(","));
        }
      }
    }

    this.headers = _cloneHeaders;
    return this;
  }

  /**
   * Post method.
   */
  post() {
    this.method = "POST";
    return new ApiInputBuilder({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      shouldThrowOnError: this.shouldThrowOnError,
      method: this.method,
      options: this.options,
      headers: this.headers,
      signal: this.signal,
    });
  }

  /**
   * Get method.
   */
  get() {
    this.method = "GET";
    return new ApiInputBuilder({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      shouldThrowOnError: this.shouldThrowOnError,
      method: this.method,
      options: this.options,
      headers: this.headers,
      signal: this.signal,
    });
  }

  /**
   * Put method.
   */
  put() {
    this.method = "PUT";
    return new ApiInputBuilder({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      shouldThrowOnError: this.shouldThrowOnError,
      method: this.method,
      options: this.options,
      headers: this.headers,
      signal: this.signal,
    });
  }

  /**
   * Delete method.
   */
  delete() {
    this.method = "DELETE";
    return new ApiInputBuilder({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      shouldThrowOnError: this.shouldThrowOnError,
      method: this.method,
      options: this.options,
      headers: this.headers,
      signal: this.signal,
    });
  }

  /**
   * Patch method.
   */
  patch() {
    this.method = "PATCH";
    return new ApiInputBuilder({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      shouldThrowOnError: this.shouldThrowOnError,
      method: this.method,
      options: this.options,
      headers: this.headers,
      signal: this.signal,
    });
  }

  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal: AbortSignal): this {
    this.signal = signal;
    return this;
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError(): this {
    this.shouldThrowOnError = true;
    return this;
  }
}
