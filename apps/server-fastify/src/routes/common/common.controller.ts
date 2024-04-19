import type { FastifyPluginCallback } from 'fastify';
import { container } from 'tsyringe';

import { CommonService } from './common.service';

const routes: FastifyPluginCallback = (fastify, opts, done) => {
  const commonService = container.resolve(CommonService);

  fastify.get('/ping', (_request, reply) => {
    const serverTime = commonService.getServerTime();

    reply.send({ serverTime });
  });

  fastify.get('/healthcheck', async (_request, reply) => {
    try {
      const healthcheck = commonService.healthcheck();
      reply.send({ ok: healthcheck });
    } catch (error) {
      reply.status(500).send({ ok: false });
    }
  });
  done();
};

export default routes;
