/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from "tailwindcss";

import baseConfig from "@template/tailwind-config/web";

export default {
  darkMode: ["class"],
  content: [
    "./src/components/shadcn/**/*.{tsx,ts,js}",
    "./src/components/shadcn/**/*.*.{tsx,ts,js}",
    "./src/layouts/**/*.*.{tsx,ts,js}",
  ],
  presets: [baseConfig],
} satisfies Config;
