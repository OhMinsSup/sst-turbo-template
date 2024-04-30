import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

@Injectable()
export class SerializeService {
  constructor() {}

  transformDataToUndefined(data: any) {
    if (data === null) {
      return undefined;
    }

    if (typeof data === 'string' && data === '') {
      return undefined;
    }

    if (typeof data === 'number' && isNaN(data)) {
      return undefined;
    }

    if (typeof data === 'object' && isEmpty(data)) {
      return undefined;
    }

    return data;
  }

  transformDataToNull(data: any) {
    if (data === undefined) {
      return null;
    }

    if (typeof data === 'string' && data === '') {
      return null;
    }

    if (typeof data === 'number' && isNaN(data)) {
      return null;
    }

    if (typeof data === 'object' && isEmpty(data)) {
      return null;
    }

    return data;
  }
}
