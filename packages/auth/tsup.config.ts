import type { Options } from "tsup";
import { defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: {
    index: "src/index.ts",
    server: "src/server/index.ts",
    client: "src/browser/index.ts",
    remix: "src/frameworks/remix/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  minify: !options.watch,
  minifyWhitespace: true,
  clean: true,
  ...options,
}));
