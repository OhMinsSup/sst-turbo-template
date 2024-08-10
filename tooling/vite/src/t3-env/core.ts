import { loadEnv } from "vite";

import { GENERATED_COMMENT, reserved, valid_identifier } from "./constants";
import { dedent, filter_private_env, filter_public_env } from "./utils";

export interface GetEnvConfigParams {
  envDir: string;
  prefixs: string[];
}

export const getEnv = (config: GetEnvConfigParams, mode: string) => {
  const env = loadEnv(mode, config.envDir, "");

  return {
    public: filter_public_env(env, { prefixs: config.prefixs }),
    private: filter_private_env(env, { prefixs: config.prefixs }),
  };
};

export function create_static_module(id: string, env: Record<string, string>) {
  const declarations: string[] = [];

  for (const key in env) {
    if (!valid_identifier.test(key) || reserved.has(key)) {
      continue;
    }

    const comment = `/** @type {import('${id}').${key}} */`;
    const declaration = `export const ${key} = ${JSON.stringify(env[key])};`;

    declarations.push(`${comment}\n${declaration}`);
  }

  return GENERATED_COMMENT + declarations.join("\n\n");
}

export function create_static_types(
  id: string,
  env: {
    public: Record<string, string>;
    private: Record<string, string>;
  },
) {
  const declarations = Object.keys(env[id as keyof typeof env])
    .filter((k) => valid_identifier.test(k))
    .map((k) => `export const ${k}: string;`);

  return dedent`
		declare module '$env/static/${id}' {
			${declarations.join("\n")}
		}
	`;
}

type SupportType = "string" | "number" | "boolean" | "object" | "array";

type Recordable<K extends string = string, T = unknown> = Record<K, T>;

const typeMap: Recordable<SupportType> = {
  boolean: "boolean",
  string: "string",
  number: "number",
  array: "any[]",
  object: "Record<string, any>",
};

export function create_import_meta_env(env: Record<string, string>) {
  const declarations = Object.keys(env)
    .filter((k) => valid_identifier.test(k))
    .map(
      (k) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        `readonly ${k}: ${typeMap[typeof env[k] as SupportType] || "any"};`,
    );

  return dedent`
		interface ImportMetaEnv {
			${declarations.join("\n")}
		}
	`;
}

export function create_process_env(env: Record<string, string>) {
  const declarations = Object.keys(env)
    .filter((k) => valid_identifier.test(k))
    .map(
      (k) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        `readonly ${k}: ${typeMap[typeof env[k] as SupportType] || "any"};`,
    );

  return dedent`
    declare namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string;
        ${declarations.join("\n")}
      }
    }
  `;
}

export const template = (env: {
  public: Record<string, string>;
  private: Record<string, string>;
}) => `
${GENERATED_COMMENT}

/// <reference types="vite/client" />

${create_import_meta_env(env.public)}

${create_static_types("private", env)}

${create_static_types("public", env)}
`;

export const template_process_env = (env: Record<string, string>) => `
${GENERATED_COMMENT}
${create_process_env(env)}
`;
