import type { $Fetch } from "ofetch";

import type {
  $OfetchOptions,
  ApiBody,
  ApiBuilderReturnValue,
  ApiQuery,
  BuilderConstructorOptions,
  FnNameKey,
  HeadersInit,
  MethodType,
} from "./types";

export default class ApiBuilder<
  FnKey extends FnNameKey = FnNameKey,
  MethodKey extends MethodType = MethodType,
> {
  protected fnKey: FnKey;

  protected url: string;

  protected pathname: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected method: MethodKey;

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected body?: ApiBody<FnKey, MethodKey> | undefined;

  protected signal?: AbortSignal;

  protected searchParams?: ApiQuery<FnKey, MethodKey>;

  constructor(builder: BuilderConstructorOptions<FnKey, MethodKey>) {
    this.fnKey = builder.fnKey;
    this.url = builder.url;
    this.fetchClient = builder.fetchClient;
    this.headers = builder.headers;
    this.method = builder.method;
    this.options = builder.options;
    this.body = builder.body;
    this.signal = builder.signal;
    this.searchParams = builder.searchParams;
    this.pathname = builder.pathname;
    if (builder.shouldThrowOnError) {
      this.shouldThrowOnError = builder.shouldThrowOnError;
    }
  }

  then<TResult1 = ApiBuilderReturnValue<FnKey, MethodKey>, TResult2 = never>(
    onfulfilled?:
      | ((
          value: ApiBuilderReturnValue<FnKey, MethodKey>,
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    const response = this.fetchClient<
      ApiBuilderReturnValue<FnKey, MethodKey>,
      "json"
    >(this.pathname, {
      ...this.options,
      method: this.method,
      headers: this.headers,
      signal: this.signal,
      params: this.searchParams,
      body: this.body,
    });

    return response.then(onfulfilled, onrejected).catch(onrejected);
  }
}
