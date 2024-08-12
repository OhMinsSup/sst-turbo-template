import path from "node:path";
import type * as Vite from "vite";
import {
  parse as esModuleLexer,
  init as initEsModuleLexer,
} from "es-module-lexer";
import { normalizePath } from "vite";

import { get_env, get_env_dir, get_env_prefix } from "./env";
import { create_static_module } from "./generate";
import { template, template_process_env } from "./template";
import { write_if_changed } from "./utils";
import { env_static_private, env_static_public } from "./vmod";

type RuntimeEnv = Record<string, string | boolean | number | undefined>;

interface T3EnvOptions<TEnv extends RuntimeEnv> {
  t3EnvFn: (
    runtimeEnv: RuntimeEnv,
    clientPrefix: string | undefined,
  ) => Readonly<TEnv>;
  envFile?: string;
  prefix?: string | string[];
}

export type VitePlugin = <TEnv extends RuntimeEnv>(
  config: T3EnvOptions<TEnv>,
) => Vite.Plugin[];

export const vitePlugin: VitePlugin = ({
  envFile,
  t3EnvFn,
  prefix = "NEXT_PUBLIC_",
}) => {
  let env: {
    public: Record<string, string>;
    private: Record<string, string>;
  };

  return [
    {
      name: "vite-plugin-t3-env",
      config: async (config, config_env) => {
        const resolvedRoot = normalizePath(
          config.root ? path.resolve(config.root) : process.cwd(),
        );

        const envDir = await get_env_dir({
          resolvedRoot,
          viteConfigEnvDir: config.envDir,
          userConfigEnvFile: envFile,
        });

        const prefixs = get_env_prefix({
          userConfigPrefix: prefix,
          viteConfigEnvPrefix: config.envPrefix,
        });

        const runtimeEnv = get_env(
          {
            envDir,
            prefixs,
          },
          config_env.mode,
        );

        for (const prefix of prefixs) {
          t3EnvFn(
            Object.assign({}, runtimeEnv.private, runtimeEnv.public),
            prefix,
          );
        }

        env = runtimeEnv;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const define: Record<string, any> = {};

        for (const key of Object.keys(runtimeEnv.public)) {
          define[`import.meta.env.${key}`] = JSON.stringify(
            runtimeEnv.public[key],
          );
        }

        for (const key of Object.keys(runtimeEnv.private)) {
          define[`process.env.${key}`] = JSON.stringify(
            runtimeEnv.private[key],
          );
        }

        return {
          define,
          optimizeDeps: {
            exclude: ["$env"],
          },
        };
      },
      /**
       * Stores the final config.
       */
      async configResolved(config) {
        await initEsModuleLexer;

        write_if_changed(
          path.resolve(config.root, "vite-env.d.ts"),
          template(env),
        );
        write_if_changed(
          path.resolve(config.root, "global.d.ts"),
          template_process_env(env.private),
        );
      },
      enforce: "pre",
    },
    {
      name: "t3-env-virtual-modules",
      resolveId(id) {
        // treat $env/static/[public|private] as virtual
        if (id.startsWith("$env/")) {
          return `\0virtual:${id}`;
        }
      },
      load(id) {
        switch (id) {
          case env_static_private: {
            return create_static_module("$env/static/private", env.private);
          }
          case env_static_public: {
            return create_static_module("$env/static/public", env.public);
          }
        }
      },
    },
    {
      name: "t3-env-private-module-server-only",
      transform(code, id, options) {
        if (options?.ssr) return;
        switch (id) {
          case env_static_private: {
            const exports = esModuleLexer(code)[1];
            return {
              code: exports
                .map(({ n: name }) =>
                  name === "default"
                    ? "export default undefined;"
                    : `export const ${name} = undefined;`,
                )
                .join("\n"),
              map: null,
            };
          }
        }
      },
    },
    {
      name: "t3-env-public-module-client-only",
      transform(code, id, options) {
        if (!options?.ssr) return;
        switch (id) {
          case env_static_public: {
            const exports = esModuleLexer(code)[1];
            return {
              code: exports
                .map(({ n: name }) =>
                  name === "default"
                    ? "export default undefined;"
                    : `export const ${name} = undefined;`,
                )
                .join("\n"),
              map: null,
            };
          }
        }
      },
    },
  ];
};
