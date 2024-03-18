import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

import base from './base';

const config: Omit<Config, 'content'> = {
  corePlugins: {
    preflight: false,
  },
  content: base.content,
  presets: [base],
  plugins: [animate],
};

export default config;
