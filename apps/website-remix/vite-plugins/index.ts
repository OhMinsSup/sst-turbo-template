import type { VitePlugin } from "./plugin";
import { vitePlugin } from "./plugin";

export const envValidatePlugin: VitePlugin = (...args) => {
  return vitePlugin(...args);
};
