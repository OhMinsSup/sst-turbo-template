export const FILE_NAME = {
  baseEnvFilename: '.env',
};

export const DEV_ENV = {
  development: 'development',
  dev: 'dev',
  d: 'd',
} as const;

export const PROD_ENV = {
  production: 'production',
  prod: 'prod',
  p: 'p',
} as const;

export const STAGING_ENV = {
  staging: 'staging',
  stg: 'stg',
} as const;

export const SNADBOX_ENV = {
  sandbox: 'sandbox',
  sbx: 'sbx',
} as const;

export const COMMON_ENV = {
  test: 'test',
  local: 'local',
} as const;

export const Env = {
  ...DEV_ENV,
  ...PROD_ENV,
  ...STAGING_ENV,
  ...SNADBOX_ENV,
  ...COMMON_ENV,
} as const;

export type EnvType = keyof typeof Env;
