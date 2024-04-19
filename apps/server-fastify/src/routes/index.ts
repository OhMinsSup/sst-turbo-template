import type { FastifyPluginCallback } from 'fastify';

import commonRoutes from './common/common.controller';

const api: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(commonRoutes, { prefix: '/common' });

  done();
};

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(api, {
    prefix: '/api',
  });

  done();
};

export default routes;
