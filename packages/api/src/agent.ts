import { BaseError, ErrorType } from '@template/error';

import type { ServiceClient } from './client';
import type { FetchHandlerOptions, MimeTypes } from './fetch/types';
import type {
  AgentConfigureOptions,
  AgentFetchHandler,
  AgentOpts,
} from './types';
import { BaseClient } from './client';
import { defaultFetchHandler } from './fetch';

export class Agent {
  service: URL;
  prefix?: string;
  api: ServiceClient;

  private _baseClient: BaseClient;

  static fetch: AgentFetchHandler | undefined = defaultFetchHandler;

  static configure(opts: AgentConfigureOptions): void {
    Agent.fetch = opts.fetch;
  }

  constructor(opts: AgentOpts) {
    this.service =
      opts.service instanceof URL ? opts.service : new URL(opts.service);
    this.prefix = opts.prefix;

    this._baseClient = new BaseClient();
    this._baseClient.fetch = this._fetch.bind(this) as AgentFetchHandler;
    this.api = this._baseClient.service(opts.service, opts.prefix);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- TSCONVERSION
  private async _fetch<
    Mime extends MimeTypes = MimeTypes,
    JsonData = Record<string, undefined>,
  >(opts: FetchHandlerOptions) {
    if (!Agent.fetch) {
      throw new BaseError(
        ErrorType.AgentError,
        'AtpAgent fetch() method not configured',
      );
    }

    // send the request
    const res = await Agent.fetch<Mime, JsonData>({
      uri: opts.uri,
      method: opts.method,
      headers: opts.headers,
      reqBody: opts.reqBody,
    });

    return res;
  }
}
