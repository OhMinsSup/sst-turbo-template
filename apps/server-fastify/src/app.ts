import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import autoload from '@fastify/autoload';
import Fastify from 'fastify';

import { envVars } from './env';
import routes from './routes';

const app = Fastify({
  logger: true,
});

const __source = envVars.NODE_ENV === 'production' ? 'dist' : 'src';

const __filename = fileURLToPath(import.meta.url);
const splited = dirname(__filename).split(`/${__source}`);
const cwd = splited.slice(0, -1).join(`/${__source}`);

app.register(autoload, {
  dir: join(cwd, `./${__source}/plugins/global`),
  encapsulate: false,
  forceESM: true,
});

app.register(routes);

export default app;
