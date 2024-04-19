import { env } from 'node:process';
import { z } from 'zod';

class MissingEnvVars extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingEnvVars';
  }
}

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production'])
    .optional()
    .default('development'),
  PORT: z.string().optional().default('8080').transform(Number),
  SERVER_HOSTNAME: z.string().optional().default('::'),
  TZ: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

const processEnv = {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  SERVER_HOSTNAME: env.SERVER_HOSTNAME,
  TZ: env.TZ,
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

export { envVars };
