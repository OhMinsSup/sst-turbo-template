import type { EnvType } from './constants';

export interface Options {
  /** @internal Used in CI. */
  envType: EnvType;
  /** @internal Used in CI. */
  loadPath: string;
  /** @internal Used in CI. */
  loadName: string;
  /** @internal Used in CI. */
  savePath: string;
  /** @internal Used in CI */
  saveName: string;
  /** @internal Used in CI */
  onSuccess?: (...args: any) => void;
  /** @internal Used in CI */
  onError?: (...args: any) => void;
}

const noop = () => {};

export const defaultOptions: Options = {
  envType: 'local',
  loadPath: './env',
  loadName: '.env',
  savePath: '.',
  saveName: '.env',
  onSuccess: noop,
  onError: noop,
};
