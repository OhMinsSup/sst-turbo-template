import { type MimeTypes } from './fetch/types';

export interface AgentFetchHandlerResponse<Body = unknown> {
  status: number;
  headers: Record<string, string>;
  body: Body;
}

export interface AgentFetchHandlerOptions {
  uri: string;
  method: string;
  headers: Headers | Record<string, string> | undefined;
  reqBody: unknown;
}

export type AgentFetchHandler = <
  Mime extends MimeTypes = MimeTypes,
  JsonData = Record<string, undefined>,
>(
  opts: AgentFetchHandlerOptions,
) => Promise<
  AgentFetchHandlerResponse<
    Mime extends 'application/json'
      ? JsonData
      : Mime extends 'text/'
        ? string
        : Mime extends 'application/octet-stream'
          ? Blob
          : Response
  >
>;

export interface AgentConfigureOptions {
  fetch: AgentFetchHandler;
}

export interface AgentOpts {
  service: string | URL;
  prefix?: string;
}
