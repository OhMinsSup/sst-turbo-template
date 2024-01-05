import { env } from 'node:process';
import { z } from 'zod';
import type { NextjsSiteProps } from 'sst/constructs';

class MissingEnvVars extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingEnvVars';
  }
}

const schema = z.object({
  WEB_SST_ID: z.string().min(1),
  WEB_SST_NAME: z.string().min(1),
  WEB_SST_REGION: z.string().min(1),
  WEB_SST_DEPLOY_GROUP: z.string().min(1),
  WEB_SST_S3_BUCKET_NAME: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

const processEnv = {
  WEB_SST_ID: env.WEB_SST_ID,
  WEB_SST_NAME: env.WEB_SST_NAME,
  WEB_SST_REGION: env.WEB_SST_REGION,
  WEB_SST_DEPLOY_GROUP: env.WEB_SST_DEPLOY_GROUP,
  WEB_SST_S3_BUCKET_NAME: env.WEB_SST_S3_BUCKET_NAME,
};

// eslint-disable-next-line import/no-mutable-exports
let envVars = {} as Schema;

const parsed = schema.safeParse(processEnv);
if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  throw new MissingEnvVars(
    'Invalid environment variables. Please check your .env file.',
  );
}

envVars = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    return Reflect.get(target, prop) || process.env[prop];
  },
});

// SSR function memory size
const MEMORY_SIZE = 1024;

// timeout in seconds
const TIMEOUT = 30;

// Purpose: Constants used in the stacks
const WEB_NEXT_JS_PROJECT_PATH = '.';

const defaultWebNextJsConfig: NextjsSiteProps | undefined = {
  path: WEB_NEXT_JS_PROJECT_PATH,
  memorySize: MEMORY_SIZE,
  timeout: TIMEOUT,
  cdk: {
    bucket: {
      versioned: true,
      bucketName: envVars.WEB_SST_S3_BUCKET_NAME,
    },
  },
};

export { envVars, defaultWebNextJsConfig };
