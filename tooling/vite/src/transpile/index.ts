import type { VitePlugin } from "./plugin";
import { vitePlugin } from "./plugin";

export const transpilePlugin: VitePlugin = (...args) => {
  return vitePlugin(...args);
};
