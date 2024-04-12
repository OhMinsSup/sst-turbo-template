import { type ServiceClient } from '.';
import { type FetchWithoutRequestHandler } from '../fetch/types';

export class TestNamespace {
  _service: ServiceClient;

  constructor(service: ServiceClient) {
    this._service = service;
  }

  postTest: FetchWithoutRequestHandler = (options) => {
    return this._service._baseClient.fetch('/test', {
      method: 'POST',
      baseURL: this._service.uri.toString(),
      ...options,
    });
  };

  getTest: FetchWithoutRequestHandler = (options) => {
    return this._service._baseClient.fetch('/test', {
      method: 'GET',
      baseURL: this._service.uri.toString(),
      ...options,
    });
  };
}
