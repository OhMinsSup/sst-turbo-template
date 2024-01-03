import { ErrorType } from './constants';

export class FetchError extends Error {
  public response: Response;
  public request: Request;
  public options: unknown;

  constructor(response: Response, request: Request, options: any) {
    const code =
      response.status || response.status === 0 ? response.status : '';
    const title = response.statusText || '';
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}`);

    this.name = ErrorType.HTTPError;
    this.response = response;
    this.request = request;
    this.options = options;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      response: this.response,
      request: this.request,
      options: this.options,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  getResponse() {
    return this.response;
  }

  getRequest() {
    return this.request;
  }

  getOptions() {
    return this.options;
  }
}
