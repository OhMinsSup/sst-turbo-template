import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { envValidatePlugin } from "./vite-plugins";

export default defineConfig({
  plugins: [
    envValidatePlugin(),
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
