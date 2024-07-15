import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

import { t3EnvPlugin } from "@template/vite/t3-env";

import { t3EnvFn } from "./env";

export default defineConfig({
  plugins: [
    t3EnvPlugin({
      envFile: "../../.env",
      t3EnvFn,
    }),
    sveltekit(),
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
