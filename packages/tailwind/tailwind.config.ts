import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Omit<Config, 'content'> = {
  corePlugins: {
    preflight: false,
  },
  plugins: [typography()],
};

export default config;
