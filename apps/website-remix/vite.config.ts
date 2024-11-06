import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { t3EnvPlugin } from "@template/vite/t3-env";

import { t3EnvFn } from "./env";

installGlobals({ nativeFetch: true });

export default defineConfig({
  plugins: [
    t3EnvPlugin({
      t3EnvFn,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_optimizeDeps: true,
        v3_singleFetch: true, // 👈 enable single-fetch
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
