import type { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

import { envVars } from '~/env';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  const corsWhitelist: RegExp[] = [];

  if (envVars.NODE_ENV === 'development') {
    corsWhitelist.push(/^http:\/\/localhost/);
  }

  fastify.register(cors, {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.some((re) => re.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  });
};

export default corsPlugin;
