import { SSTConfig } from 'sst';
import { WebNextApp } from './stacks/web-nextjs-app';
import { env } from './stacks/constants';

const config: SSTConfig = {
  config(_input) {
    return {
      name: env.WEB_SST_NAME,
      region: env.WEB_SST_REGION,
      stage: env.WEB_SST_DEPLOY_GROUP,
    };
  },
  stacks(app) {
    app.stack(WebNextApp);
  },
};

export default config;
