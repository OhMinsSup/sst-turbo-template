import { injectable, singleton } from 'tsyringe';

import { formatDate } from '@template/date';

interface Service {
  getServerTime: () => string;
  healthcheck: () => boolean;
}

@singleton()
@injectable()
export class CommonService implements Service {
  public getServerTime() {
    try {
      return formatDate(new Date());
    } catch (error) {
      return 'Invalid date instance';
    }
  }

  public healthcheck() {
    return true;
  }
}
