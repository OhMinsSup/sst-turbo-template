import path from "node:path";
import type * as Vite from "vite";
import { normalizePath } from "vite";

type DefaultVariable = Record<string, unknown>;

async function loadEnvFile() {}

interface ValidateEnvParams<Variable extends DefaultVariable>
  extends Pick<PluginOptions<Variable>, "envFile" | "envVariable"> {
  config: Vite.UserConfig;
  env: Vite.ConfigEnv;
}

async function validateEnv<Variable extends DefaultVariable>({
  config,
  env,
}: ValidateEnvParams<Variable>) {
  const rootDir = config.root ?? process.cwd();

  const resolvedRoot = normalizePath(
    config.root ? path.resolve(config.root) : process.cwd(),
  );

  const envDir = config.envDir
    ? normalizePath(path.resolve(resolvedRoot, config.envDir))
    : resolvedRoot;
  console.log("rootDir", rootDir);
  console.log("resolvedRoot", resolvedRoot);
  console.log("envDir", envDir);
  return {};
}

export interface PluginOptions<Variable extends DefaultVariable> {
  envFile?: string;
  envVariable?: Variable;
}

export type VitePlugin = <Variable extends DefaultVariable>(
  config?: PluginOptions<Variable>,
) => Vite.Plugin[];

export const vitePlugin: VitePlugin = (opts) => {
  return [
    {
      name: "vite-plugin-env-validate",
      config: (config, env) => {
        return validateEnv({
          env,
          config,
          envFile: opts?.envFile,
          envVariable: opts?.envVariable,
        });
      },
      enforce: "pre",
    },
  ];
};
