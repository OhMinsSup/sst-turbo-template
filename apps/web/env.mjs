import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    SITE_URL: z.string().min(1).default('http://localhost:3000'),
    API_PREFIX: z.string().default('/api'),
  },
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
  },
  runtimeEnv: {
    // server
    NODE_ENV: process.env.NODE_ENV,
    DEPLOY_GROUP: process.env.DEPLOY_GROUP,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
    // client
    SITE_URL: process.env.SITE_URL,
    API_PREFIX: process.env.API_PREFIX,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === 'lint',
});
