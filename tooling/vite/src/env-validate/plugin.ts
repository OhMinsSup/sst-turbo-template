import type * as Vite from "vite";

export interface PluginConfig {}

export type VitePlugin = (config?: PluginConfig) => Vite.Plugin[];

export const vitePlugin: VitePlugin = () => {
  return [
    {
      name: "vite-plugin-env-validate",
    },
  ];
};
