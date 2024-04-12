import { handle } from 'hono/aws-lambda';
import { ApiHandler } from 'sst/node/api';

import { app } from './server';

// Wrap in the SST ApiHandler so we can call useSession in the app
export const handler = ApiHandler(async (event) => {
  const honoHandler = handle(app);
  return honoHandler(event);
});
