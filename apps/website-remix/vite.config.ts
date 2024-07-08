import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { t3EnvPlugin } from "@template/vite/t3-env";

import { t3EnvFn } from "./app/env";

// import { t3EnvPlugin } from "./vite-plugins";

export default defineConfig({
  plugins: [
    t3EnvPlugin({
      envFile: "../../.env",
      t3EnvFn,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
        unstable_fogOfWar: true,
      },
    }),
    tsconfigPaths(),
  ],
});
