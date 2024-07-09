import fs from "node:fs";
import path from "node:path";
import type * as Vite from "vite";
import { loadEnv, normalizePath } from "vite";

// vite 환경 변수 DTS 파일 이름
const VITE_ENV_DTS_FILENAME = "vite-env.d.ts";
// process.env 환경 변수 DTS 파일 이름
const PROCESS_ENV_DTS_FILENAME = "global.d.ts";
// import.meta.env.* regex의 모든 값을 가져오기 위한 정규식
const IMPORT_META_ENV_REGEX = /^import\.meta\.env\..+/;
const TYPESCRIPT_INTERFACE_IMPORT_META_ENV_REGEXP =
  /interface ImportMetaEnv\s*\{[\s\S]*?\}/g;
// process.env.* regex 모든 값을 가져오기 위한 정규식
const PROCESS_ENV_REGEX = /^process\.env\..+/;
const TYPESCRIPT_INTERFACE_PROCESS_ENV_REGEXP =
  /declare namespace NodeJS\s*\{\s*interface ProcessEnv\s*\{[\s\S]*?\}\s*\}/g;

// 기본 process.env prefix
const DEFAULT_PROCESS_ENV_PREFIX = "";

type RuntimeEnv = Record<string, string | boolean | number | undefined>;

type SupportType = "string" | "number" | "boolean" | "object" | "array";

type Recordable<K extends string = string, T = unknown> = Record<K, T>;

function makeInterfaceItem(
  env: Recordable,
  commentRecord: Recordable<string, string>,
) {
  const interfaceItem: string[] = [];
  const typeMap: Recordable<SupportType> = {
    boolean: "boolean",
    string: "string",
    number: "number",
    array: "any[]",
    object: "Record<string, any>",
  };
  for (const envKey of Object.keys(env)) {
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

  return interfaceItem;
}

function writeEnvInterface(
  path: string,
  envInterface: string,
  regex: RegExp,
  isViteEnv = true,
) {
  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
    if (regex.test(fileContent)) {
      // replace
      envInterface = fileContent.replace(regex, envInterface);
    } else {
      // append
      envInterface = `${fileContent}
${envInterface}`;
    }
  } else {
    envInterface = `${isViteEnv ? '/// <reference types="vite/client" />\n\n' : ""}
${envInterface}`;
  }
  fs.writeFileSync(path, envInterface);
}

function generateEnvTypescript(
  env: Recordable,
  commentRecord: Recordable<string, string>,
  isViteEnv = true,
) {
  const interfaceItem = makeInterfaceItem(env, commentRecord);

  if (isViteEnv) {
    return `interface ImportMetaEnv {
      // Auto generate by env-parse
      ${interfaceItem.join("\n  ")}
    }`;
  }

  return `declare namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      // Auto generate by env-parse
      ${interfaceItem.join("\n  ")}
    }
  }`;
}

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

        let envPrefix: string | string[] | undefined = undefined;
        if (prefix) {
          envPrefix = prefix;
        }

        if (typeof envPrefix === "undefined" || !envPrefix) {
          envPrefix = config.envPrefix;
        }

        const clientPrefix = Array.isArray(envPrefix)
          ? envPrefix.at(0)
          : envPrefix;

        const processEnvVar = loadEnv(
          env.mode,
          envDir,
          DEFAULT_PROCESS_ENV_PREFIX,
        );

        const envVar = loadEnv(env.mode, envDir, envPrefix);

        const runtimeEnv = {
          ...processEnvVar,
          ...envVar,
        };

        const defineEnv = t3EnvFn(runtimeEnv, clientPrefix);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const define: Record<string, any> = {};
        for (const key of Object.keys(defineEnv)) {
          // prefix를 가진 key값을 import.meta.env.*로 변경
          if (Array.isArray(envPrefix)) {
            const prefix = envPrefix.find((prefix) => key.startsWith(prefix));
            if (prefix) {
              define[`import.meta.env.${key}`] = JSON.stringify(defineEnv[key]);
              continue;
            }
          } else if (
            typeof envPrefix === "string" &&
            key.startsWith(envPrefix)
          ) {
            define[`import.meta.env.${key}`] = JSON.stringify(defineEnv[key]);
            continue;
          } else {
            define[`process.env.${key}`] = JSON.stringify(defineEnv[key]);
          }
        }

        return {
          define,
        };
      },
      configResolved: (config) => {
        if (config.define) {
          const importMetaEnvVar = Object.keys(config.define).reduce(
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

          const processEnvVar = Object.keys(config.define).reduce(
            (acc, key) => {
              if (PROCESS_ENV_REGEX.test(key)) {
                const envKey = key.replace("process.env.", "");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                acc[envKey] = config.define?.[key];
              }
              return acc;
            },
            {} as Record<string, string | boolean | number | undefined>,
          );

          writeEnvInterface(
            path.resolve(config.root, VITE_ENV_DTS_FILENAME),
            generateEnvTypescript(importMetaEnvVar, {}, true),
            TYPESCRIPT_INTERFACE_IMPORT_META_ENV_REGEXP,
            true,
          );

          writeEnvInterface(
            path.resolve(config.root, PROCESS_ENV_DTS_FILENAME),
            generateEnvTypescript(processEnvVar, {}, false),
            TYPESCRIPT_INTERFACE_PROCESS_ENV_REGEXP,
            false,
          );
        }
      },
      enforce: "pre",
    },
  ];
};
