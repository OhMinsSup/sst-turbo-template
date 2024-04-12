import type * as sst from 'sst/constructs';

import { ApiStack } from './api';

export default function bootstrap(app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs18.x',
  });

  app.stack((input) => {
    ApiStack(input);
  });
}
