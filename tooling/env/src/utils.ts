import type { EnvType } from './constants';
import {
  COMMON_ENV,
  DEV_ENV,
  FILE_NAME,
  PROD_ENV,
  SNADBOX_ENV,
  STAGING_ENV,
} from './constants';

const makeRegExp = (obj: Record<string, string>) => {
  return new RegExp(Object.keys(obj).join('|').replace(/\$/g, '\\$'), 'i');
};

export const DEV_ENV_REG_EXP = makeRegExp(DEV_ENV);
export const PROD_ENV_REG_EXP = makeRegExp(PROD_ENV);
export const STAGING_ENV_REG_EXP = makeRegExp(STAGING_ENV);
export const SANDBOX_ENV_REG_EXP = makeRegExp(SNADBOX_ENV);
export const COMMON_ENV_REG_EXP = makeRegExp(COMMON_ENV);

export const compareTextSize = <T extends Record<string, string>>(obj: T) => {
  return Object.keys(obj).reduce((acc, cur) => {
    if (acc.length > cur.length) return acc;
    return cur;
  }, '');
};

export const makeName = (name1: string, name2: string, prefix = '.') => {
  return `${name1}${prefix}${name2}`;
};

export const makeEnvFileName = (env: EnvType) => {
  return makeName(FILE_NAME.baseEnvFilename, matchEnv(env));
};

export const matchEnv = (env: string) => {
  const matchDev = env.match(DEV_ENV_REG_EXP);
  if (matchDev) {
    const values = compareTextSize(DEV_ENV);
    if (!values) throw new Error('env is not defined');
    return values;
  }

  const matchProd = env.match(PROD_ENV_REG_EXP);
  if (matchProd) {
    const values = compareTextSize(PROD_ENV);
    if (!values) throw new Error('env is not defined');
    return values;
  }

  const matchStaging = env.match(STAGING_ENV_REG_EXP);
  if (matchStaging) {
    const values = compareTextSize(STAGING_ENV);
    if (!values) throw new Error('env is not defined');
    return values;
  }

  const matchSandbox = env.match(SANDBOX_ENV_REG_EXP);
  if (matchSandbox) {
    const values = compareTextSize(SNADBOX_ENV);
    if (!values) throw new Error('env is not defined');
    return values;
  }

  const matchCommon = env.match(COMMON_ENV_REG_EXP);
  if (matchCommon) {
    const values = matchCommon.at(0);
    if (!values) throw new Error('env is not defined');
    return values;
  }

  throw new Error('env is not defined');
};

export const deepEqual = (x: unknown, y: unknown): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        // @ts-expect-error deepEqual type
        ok(x).every((key) => deepEqual(x[key], y[key]) as unknown as boolean)
    : x === y;
};
