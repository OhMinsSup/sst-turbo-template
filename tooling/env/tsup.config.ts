import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    external: [/^\$/],
  },
  {
    clean: true,
    entry: {
      'cli-default': 'src/cli-default.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    external: [/^\$/],
  },
]);
