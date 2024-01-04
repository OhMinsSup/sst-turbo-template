import { AppAgent } from '@template/api';
import { env } from 'env.mjs';

export const agent = new AppAgent({
  service: env.SITE_URL,
  prefix: env.API_PREFIX,
});
