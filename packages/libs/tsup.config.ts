import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  minifyWhitespace: true,
  clean: true,
  ...options,
}));
