import fs from 'node:fs/promises';
import path from 'node:path';
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

const DIST_PATH = './dist';

async function addDirectivesToChunkFiles(distPath = DIST_PATH): Promise<void> {
  try {
    const files = await fs.readdir(distPath);

    for (const file of files) {
      if (
        file.startsWith('chunk-') &&
        (file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith('.cjs'))
      ) {
        const filePath = path.join(distPath, file);

        const data = await fs.readFile(filePath, 'utf8');

        const updatedContent = `'use client';\n${data}`;

        await fs.writeFile(filePath, updatedContent, 'utf8');

        // eslint-disable-next-line no-console -- We need to log the result
        console.log(`Directive has been added to ${file}`);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- We need to log the error
    console.error('Error:', err);
  }
}

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  platform: 'browser',
  dts: true,
  minify: true,
  minifyWhitespace: true,
  clean: true,
  external: ['react'],
  async onSuccess() {
    await addDirectivesToChunkFiles();
  },
  ...options,
}));
