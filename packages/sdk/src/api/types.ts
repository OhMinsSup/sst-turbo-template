import type { $Fetch, FetchOptions } from "ofetch";

import type { PostPayload, UserExternalPayload } from "@template/db/selectors";

import type { HttpResultStatus } from "./constants";
import type {
  FormFieldCreatePostSchema,
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignoutSchema,
  FormFieldSignUpSchema,
  FormFieldVerifyTokenSchema,
  QueryGetInfinitePostSchema,
  Schema,
} from "./schema";

// common types -----------------------------------
export type $OfetchOptions = Omit<
  FetchOptions<"json">,
  "body" | "baseURL" | "headers" | "signal" | "params"
>;

export type HeadersInit = FetchOptions<"json">["headers"];
export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface ClientResponse<Data = unknown> {
  resultCode: HttpResultStatus;
  message?: string | string[] | Record<string, unknown> | null;
  error?: string | string[] | Record<string, unknown> | null;
  result: Data;
}

export interface Endpoint {
  pathname: string | ((...args: any[]) => string);
  searchParamsSchema?: Schema["getInfinitePost"] | undefined;
  paramsSchema?: Schema["byUserId"] | undefined;
  bodySchema?:
    | Schema["signUp"]
    | Schema["signIn"]
    | Schema["refresh"]
    | Schema["verify"]
    | Schema["signOut"]
    | Schema["createPost"]
    | undefined;
}

export interface Endpoints {
  signUp: Endpoint;
  signIn: Endpoint;
  signOut: Endpoint;
  refresh: Endpoint;
  verify: Endpoint;
  me: Endpoint;
  byUserId: Endpoint;
  getInfinitePost: Endpoint;
  createPost: Endpoint;
}

export type EndpointsKey = keyof Endpoints;

// api.client.ts -----------------------------------

export interface Options {
  /**
   * API URL.
   * @description API URL.
   * @example 'https://api.example.com'
   */
  url: string;
  /**
   * api prefix
   * @description API prefix.
   * @example '/api/v1'
   */
  prefix?: string;
  /**
   * Fetch options.
   * @description $fetchOptions는 ofetch의 FetchOptions와 동일합니다.
   */
  options?: $OfetchOptions;
  /**
   * Custom fetch function.
   * @description $fetch는 ofetch의 $Fetch와 동일합니다.
   * @default ofetch
   */
  fetchClient?: $Fetch;
}

export type FnNameKey = EndpointsKey;

export interface RpcOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
  path?: Record<string, string>;
  options?: $OfetchOptions;
}

// api.input.ts -----------------------------------
export interface ApiInputBuilderConstructorOptions<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  shouldThrowOnError?: boolean;
  method: MethodKey;
  options?: $OfetchOptions;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

// api.http.builder.ts -----------------------------------
// api.transform.builder.ts -----------------------------------
export type ApiQuery<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = MethodKey extends "GET"
  ? FnKey extends "getInfinitePost"
    ? QueryGetInfinitePostSchema
    : never
  : never;

export type ApiParams<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = MethodKey extends "GET"
  ? FnKey extends "byUserId"
    ? { id: string }
    : never
  : never;

export type ApiBody<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = FnKey extends "signUp"
  ? MethodKey extends "POST"
    ? FormFieldSignUpSchema
    : undefined
  : FnKey extends "signIn"
    ? MethodKey extends "POST"
      ? FormFieldSignInSchema
      : undefined
    : FnKey extends "refresh"
      ? MethodKey extends "PATCH"
        ? FormFieldRefreshTokenSchema
        : undefined
      : FnKey extends "verify"
        ? MethodKey extends "POST"
          ? FormFieldVerifyTokenSchema
          : undefined
        : FnKey extends "signOut"
          ? MethodKey extends "POST"
            ? FormFieldSignoutSchema
            : undefined
          : FnKey extends "createPost"
            ? MethodKey extends "POST"
              ? FormFieldCreatePostSchema
              : never
            : never;

export interface TransformBuilderConstructorOptions<FnKey extends FnNameKey> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  options?: $OfetchOptions;
  headers?: HeadersInit;
  signal?: AbortSignal;
  path?: Record<string, string>;
}

// api.builder.ts -----------------------------------
export interface BuilderConstructorOptions<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  pathname: string;
  shouldThrowOnError?: boolean;
  method: MethodKey;
  options?: $OfetchOptions;
  headers?: HeadersInit;
  body?: ApiBody<FnKey, MethodKey>;
  signal?: AbortSignal;
  searchParams?: ApiQuery<FnKey, MethodKey>;
}

// response types -----------------------------------

interface TokenItemSchema {
  token: string;
  expiresAt: Date | number | string;
}

export interface TokenResponse {
  accessToken: TokenItemSchema;
  refreshToken: TokenItemSchema;
}

export interface AuthResponse
  extends Pick<UserExternalPayload, "email" | "id" | "name" | "image"> {
  tokens: TokenResponse;
}

export type UserResponse = UserExternalPayload;

export interface DataIdResponse<IdType = string> {
  dataId: IdType;
}

export interface ListResponse<Data> {
  totalCount: number;
  list: Data[];
  pageInfo: {
    currentPage: number;
    hasNextPage: boolean;
    nextPage: number | null;
  };
}

// api.builder.ts -----------------------------------

type ApiResponse<FnKey, MethodKey> = FnKey extends "signUp"
  ? MethodKey extends "POST"
    ? AuthResponse
    : never
  : FnKey extends "signIn"
    ? MethodKey extends "POST"
      ? AuthResponse
      : never
    : FnKey extends "refresh"
      ? MethodKey extends "PATCH"
        ? AuthResponse
        : never
      : FnKey extends "verify"
        ? MethodKey extends "POST"
          ? boolean
          : never
        : FnKey extends "signOut"
          ? MethodKey extends "POST"
            ? boolean
            : never
          : FnKey extends "me"
            ? MethodKey extends "GET"
              ? UserResponse
              : never
            : FnKey extends "byUserId"
              ? MethodKey extends "GET"
                ? UserResponse
                : never
              : FnKey extends "getInfinitePost"
                ? MethodKey extends "GET"
                  ? ListResponse<PostPayload>
                  : never
                : FnKey extends "createPost"
                  ? MethodKey extends "POST"
                    ? DataIdResponse
                    : never
                  : never;

export type ApiBuilderReturnValue<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = ClientResponse<ApiResponse<FnKey, MethodKey>>;
