import { AppAgent } from '@template/api';
import { env } from 'env.mjs';

export const agent = new AppAgent({
  service: env.NEXT_PUBLIC_SITE_URL,
  prefix: '/api',
});
