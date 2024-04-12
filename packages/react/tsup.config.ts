import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  platform: 'browser',
  dts: true,
  minify: !options.watch,
  minifyWhitespace: true,
  clean: true,
  ...options,
}));
