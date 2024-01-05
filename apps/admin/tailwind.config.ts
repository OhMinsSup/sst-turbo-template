import type { Config } from 'tailwindcss';
import sharedConfig from '@template/tailwind';

const config: Pick<Config, 'content' | 'presets' | 'darkMode'> = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  presets: [sharedConfig],
};

export default config;
