import type { Options } from "tsup";
import { defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: {
    "t3-env": "src/t3-env/index.ts",
    transpile: "src/transpile/index.ts",
  },
  format: ["esm"],
  dts: true,
  minify: !options.watch,
  minifyWhitespace: true,
  clean: true,
  external: ["vite"],
  ...options,
}));
