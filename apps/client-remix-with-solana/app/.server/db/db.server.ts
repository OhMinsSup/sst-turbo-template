import { remember } from '@epic-web/remember';
import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

const prisma = remember('prisma', getClient);

function getClient() {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient();

  // NOTE: if you change anything in this function you'll need to restart
  // the dev server to see your changes.

  // we'll set the logThreshold to 0 so you see all the queries, but in a
  // production app you'd probably want to fine-tune this value to something
  // you're more comfortable with.
  const logThreshold = 0;

  // @ts-ignore - this is a private property
  client.$on('query', async (e: any) => {
    const duration = e.duration;

    if (duration < logThreshold) {
      return;
    }

    const color =
      duration < logThreshold * 1.1
        ? 'green'
        : duration < logThreshold * 1.2
          ? 'blue'
          : duration < logThreshold * 1.3
            ? 'yellow'
            : duration < logThreshold * 1.4
              ? 'redBright'
              : 'red';
    const dur = chalk[color](`${duration}ms`);

    console.info(`prisma:query - ${dur} - ${e.query}`);
  });

  client.$connect();

  return client;
}

export { prisma };
