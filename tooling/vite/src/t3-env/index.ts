import type { VitePlugin } from "./plugin";
import { vitePlugin } from "./plugin";

export const t3EnvPlugin: VitePlugin = (...args) => {
  return vitePlugin(...args);
};
