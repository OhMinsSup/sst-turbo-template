import fs from "node:fs";
import path from "node:path";
import type * as Vite from "vite";
import { loadEnv, normalizePath } from "vite";

const DTS_FILENAME = "env.d.ts";
// import.meta.env.* regex *값을 가져오기 위한 정규식
const IMPORT_META_ENV_REGEX = /^import\.meta\.env\..+/;

type RuntimeEnv = Record<string, string | boolean | number | undefined>;

type SupportType = "string" | "number" | "boolean" | "object" | "array";

type Recordable<K extends string = string, T = unknown> = Record<K, T>;

function writeEnvInterface(path: string, envInterface: string) {
  const importMetaEnvRegexp = /interface ImportMetaEnv\s*\{[\s\S]*?\}/g;
  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
    if (importMetaEnvRegexp.test(fileContent)) {
      // replace
      envInterface = fileContent.replace(importMetaEnvRegexp, envInterface);
    } else {
      // append
      envInterface = `${fileContent}
${envInterface}`;
    }
  } else {
    envInterface = `/// <reference types="vite/client" />
${envInterface}`;
  }
  fs.writeFileSync(path, envInterface);
}

function generateTypescript(
  env: Recordable,
  commentRecord: Recordable<string, string>,
) {
  const interfaceItem: string[] = [];
  const excludeKey = ["MODE", "BASE_URL", "PROD", "DEV", "SSR"];
  const typeMap: Recordable<SupportType> = {
    boolean: "boolean",
    string: "string",
    number: "number",
    array: "any[]",
    object: "Record<string, any>",
  };
  for (const envKey of Object.keys(env)) {
    if (excludeKey.includes(envKey)) continue;

    const value = env[envKey];
    const comment = commentRecord[envKey];
    let valueType = typeof value as SupportType;
    valueType =
      valueType === "object"
        ? Array.isArray(value)
          ? "array"
          : valueType
        : valueType;
    const jsDocComment = comment
      ? `/**
   * ${comment}
   */
  `
      : "";
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    const keyValue = `readonly ${envKey}: ${typeMap[valueType] || "any"}`;

    interfaceItem.push(jsDocComment + keyValue);
  }

  return `interface ImportMetaEnv {
  // Auto generate by env-parse
  ${interfaceItem.join("\n  ")}
}`;
}

interface T3EnvOptions<TEnv extends RuntimeEnv> {
  t3EnvFn: (runtimeEnv: RuntimeEnv) => Readonly<TEnv>;
  envFile?: string;
}

export type VitePlugin = <TEnv extends RuntimeEnv>(
  config: T3EnvOptions<TEnv>,
) => Vite.Plugin[];

export const vitePlugin: VitePlugin = ({ envFile, t3EnvFn }) => {
  return [
    {
      name: "vite-plugin-t3-env",
      config: (config, env) => {
        const resolvedRoot = normalizePath(
          config.root ? path.resolve(config.root) : process.cwd(),
        );

        let envDir = resolvedRoot;
        if (envFile) {
          envDir = path.resolve(resolvedRoot, path.dirname(envFile));
        } else if (config.envDir) {
          envDir = normalizePath(path.resolve(resolvedRoot, config.envDir));
        }

        const envVar = loadEnv(env.mode, envDir, "");

        const defineEnv = t3EnvFn(envVar);

        return {
          define: Object.entries(defineEnv).reduce(
            (acc, [key, value]) => {
              acc[`import.meta.env.${key}`] = value;
              return acc;
            },
            {} as Record<string, unknown>,
          ),
        };
      },
      configResolved: (config) => {
        if (config.define) {
          const envVar = Object.keys(config.define).reduce(
            (acc, key) => {
              if (IMPORT_META_ENV_REGEX.test(key)) {
                const envKey = key.replace("import.meta.env.", "");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                acc[envKey] = config.define?.[key];
              }
              return acc;
            },
            {} as Record<string, string | boolean | number | undefined>,
          );

          writeEnvInterface(
            path.resolve(config.root, DTS_FILENAME),
            generateTypescript(envVar, {}),
          );
        }
      },
      enforce: "pre",
    },
  ];
};
