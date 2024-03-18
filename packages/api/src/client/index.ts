import type { MimeTypes, MimeTypesEnum, QueryParams } from '../fetch/types';
import type { AgentFetchHandler, AgentFetchHandlerResponse } from '../types';
import type { CallOptions } from './types';
import { defaultFetchHandler } from '../fetch';
import { constructMethodCallUri } from '../fetch/utils';

export class BaseClient {
  fetch: AgentFetchHandler = defaultFetchHandler;

  service(serviceUri: string | URL, prefix?: string): ServiceClient {
    return new ServiceClient(this, serviceUri, prefix);
  }
}

export class ServiceClient {
  _baseClient: BaseClient;

  uri: URL;
  prefix?: string;
  app: AppNamespace;

  constructor(
    baseClient: BaseClient,
    serviceUri: string | URL,
    prefix?: string,
  ) {
    this._baseClient = baseClient;
    this.uri =
      typeof serviceUri === 'string' ? new URL(serviceUri) : serviceUri;
    this.prefix = prefix;
    this.app = new AppNamespace(this);
  }

  makePathname(pathname: string): string {
    // eslint-disable-next-line no-nested-ternary -- TSCONVERSION
    const prefix = this.prefix
      ? this.prefix.startsWith('/')
        ? this.prefix
        : `/${this.prefix}`
      : '';
    const pathnamePrefix = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${prefix}${pathnamePrefix}`;
  }
}

export class AppNamespace {
  _service: ServiceClient;
  test: TestNamespace;

  constructor(service: ServiceClient) {
    this._service = service;
    this.test = new TestNamespace(service);
  }
}

export class TestNamespace {
  _service: ServiceClient;

  constructor(service: ServiceClient) {
    this._service = service;
  }

  postTest(
    body: unknown,
    opts?: CallOptions | undefined,
  ): Promise<AgentFetchHandlerResponse<Record<string, string>>> {
    const httpUri = constructMethodCallUri(
      this._service.makePathname('/test'),
      this._service.uri,
    );
    const httpHeaders = opts?.headers;

    return this._service._baseClient.fetch<
      MimeTypesEnum.ApplicationJson,
      Record<string, string>
    >({
      uri: httpUri,
      method: 'POST',
      headers: httpHeaders,
      reqBody: body,
    });
  }

  getTest(
    params: QueryParams,
    opts?: CallOptions | undefined,
  ): Promise<AgentFetchHandlerResponse<Record<string, string>>> {
    const httpUri = constructMethodCallUri(
      this._service.makePathname('/test'),
      this._service.uri,
      params,
    );
    const httpHeaders = opts?.headers;
    const httpReqBody = undefined;

    return this._service._baseClient.fetch<
      MimeTypesEnum.ApplicationJson,
      Record<string, string>
    >({
      uri: httpUri,
      method: 'GET',
      headers: httpHeaders,
      reqBody: httpReqBody,
    });
  }
}
