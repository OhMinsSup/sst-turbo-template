import { defineConfig } from 'tsup';

export default defineConfig({
  treeshake: true,
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  external: [/^\$/],
});
