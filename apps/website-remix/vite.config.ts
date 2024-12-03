import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { t3EnvPlugin } from "@template/vite/t3-env";

import { t3EnvFn } from "./env";

// declare module로 이렇게 설정을 안하면 remix에서 data() 으로 리턴한
// 값이 잘못된 타입으로 인식되어서 에러가 발생한다.
declare module "@remix-run/node" {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }
}

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
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
