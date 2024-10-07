import type { $Fetch } from "ofetch";

import type {
  $OfetchOptions,
  ApiBody,
  ApiInputBuilderConstructorOptions,
  ApiParams,
  ApiQuery,
  Endpoints,
  FnNameKey,
  HeadersInit,
  MethodType,
} from "./types";
import ApiBuilder from "./api.builder";
import { HttpStatus } from "./constants";
import { createHttpError } from "./errors";
import { schema } from "./schema";

export class ApiInputBuilder<
  FnKey extends FnNameKey = FnNameKey,
  MethodKey extends MethodType = MethodType,
> {
  protected fnKey: FnKey;

  protected url: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected method: MethodKey;

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected signal?: AbortSignal;

  protected endpoints: Endpoints = {
    signUp: {
      pathname: "/auth/signup",
      bodySchema: schema.signUp,
    },
    signIn: {
      pathname: "/auth/signin",
      bodySchema: schema.signIn,
    },
    refresh: {
      pathname: "/auth/refresh",
      bodySchema: schema.refresh,
    },
    verify: {
      pathname: "/auth/verify",
      bodySchema: schema.verify,
    },
    me: {
      pathname: "/users",
    },
    byUserId: {
      pathname: (id: string) => `/users/${id}`,
      paramsSchema: schema.byUserId,
    },
    signOut: {
      pathname: "/auth/signout",
      bodySchema: schema.signOut,
    },
    getInfinitePost: {
      pathname: "/posts",
      searchParamsSchema: schema.getInfinitePost,
    },
    createPost: {
      pathname: "/posts",
      bodySchema: schema.createPost,
    },
  };

  // input

  protected searchParams?: ApiQuery<FnKey, MethodKey>;

  protected body?: ApiBody<FnKey, MethodKey>;

  protected params?: ApiParams<FnKey, MethodType> | string;

  constructor(builder: ApiInputBuilderConstructorOptions<FnKey, MethodKey>) {
    this.fnKey = builder.fnKey;
    this.url = builder.url;
    this.fetchClient = builder.fetchClient;
    this.headers = builder.headers;
    this.method = builder.method;
    this.options = builder.options;
    this.signal = builder.signal;
    if (builder.shouldThrowOnError) {
      this.shouldThrowOnError = builder.shouldThrowOnError;
    }
  }

  /**
   * Set the Safe Search Params
   * @param {ApiQuery<FnKey, MethodKey>} searchParams
   */
  setSafeSearchParams(searchParams: ApiQuery<FnKey, MethodKey>) {
    const endpoint = this.endpoints[this.fnKey];
    if (!endpoint.searchParamsSchema) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Search params schema not found for ${this.fnKey}`,
      });
    }

    const input = endpoint.searchParamsSchema.safeParse(searchParams);
    if (!input.success) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid Query",
        data: {
          [input.error.name]: {
            message: input.error.message,
          },
        },
      });
    }

    this.searchParams = input.data as ApiQuery<FnKey, MethodKey>;
    return this;
  }

  /**
   * Set the UnSafe Search Params
   * @param {ApiQuery<FnKey, MethodKey>} searchParams
   */
  setUnsafeSearchParams(searchParams: ApiQuery<FnKey, MethodKey>) {
    this.searchParams = searchParams;
    return this;
  }

  /**
   * Set the Safe Body
   * @param {ApiBody<FnKey, MethodKey>} body
   */
  setSafeBody(body: ApiBody<FnKey, MethodKey>) {
    const endpoint = this.endpoints[this.fnKey];
    if (!endpoint.bodySchema) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Body schema not found for ${this.fnKey}`,
      });
    }

    const input = endpoint.bodySchema.safeParse(body);
    if (!input.success) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid Body",
        data: {
          [input.error.name]: {
            message: input.error.message,
          },
        },
      });
    }

    this.body = input.data as ApiBody<FnKey, MethodKey>;
    return this;
  }

  /**
   * Set the UnSafe Body
   * @param {ApiBody<FnKey, MethodKey>} body
   */
  setUnsafeBody(body: ApiBody<FnKey, MethodKey>) {
    this.body = body;
    return this;
  }

  private _makeParamsPathname() {
    const _endpoint = this.endpoints[this.fnKey];

    let pathname: string | null = null;
    if (typeof _endpoint.pathname === "function" && this.params) {
      pathname = _endpoint.pathname(...Object.values(this.params));
    } else if (typeof _endpoint.pathname === "string" && this.params) {
      // ex) /users/:id -> /users/1, /users/:id/:name -> /users/1/john
      pathname = Object.entries(this.params).reduce(
        (acc, [key, value]) => acc.replace(new RegExp(`:${key}`, "g"), value),
        _endpoint.pathname,
      );
    } else if (typeof _endpoint.pathname === "string") {
      pathname = _endpoint.pathname;
    }

    if (!pathname) {
      throw createHttpError({
        statusMessage: "Not Found",
        statusCode: HttpStatus.NOT_FOUND,
        message: "Invalid pathname",
      });
    }

    return pathname;
  }

  /**
   * Set the Safe Params
   * @param {ApiParams<FnKey, MethodKey>} params
   */
  setSafeParams(params: ApiParams<FnKey, MethodType>) {
    const endpoint = this.endpoints[this.fnKey];
    if (!endpoint.paramsSchema) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Params schema not found for ${this.fnKey}`,
      });
    }

    const input = endpoint.paramsSchema.safeParse(params);
    if (!input.success) {
      throw createHttpError({
        statusMessage: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Invalid Params",
        data: {
          [input.error.name]: {
            message: input.error.message,
          },
        },
      });
    }

    this.params = input.data as ApiParams<FnKey, MethodType>;
    return this;
  }

  /**
   * Set the UnSafe Params
   * @param {ApiParams<FnKey, MethodType>} params
   */
  setUnsafeParams(params: ApiParams<FnKey, MethodType>) {
    this.params = params;
    return this;
  }

  run() {
    const pathname = this._makeParamsPathname();

    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: this.method,
      options: this.options,
      body: this.body,
      signal: this.signal,
      pathname,
      shouldThrowOnError: this.shouldThrowOnError,
    });
  }
}
