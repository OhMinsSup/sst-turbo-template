import type { Config } from 'tailwindcss';
import baseConfig from '@tooling/tailwind-config/admin';

export default {
  content: [...baseConfig.content, '../../packages/ui/**/*.{ts,tsx}'],
  presets: [baseConfig],
} satisfies Config;
