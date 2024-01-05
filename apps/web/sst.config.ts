import type { SSTConfig } from 'sst';
import { WebNextApp } from './stacks/web-nextjs-app';
import { envVars } from './stacks/constants';

const config: SSTConfig = {
  config(_input) {
    return {
      name: envVars.WEB_SST_NAME,
      region: envVars.WEB_SST_REGION,
      stage: envVars.WEB_SST_DEPLOY_GROUP,
    };
  },
  stacks(app) {
    app.stack(WebNextApp);
  },
};

export default config;
