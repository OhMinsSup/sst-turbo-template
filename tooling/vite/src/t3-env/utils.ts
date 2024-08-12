import fs from "node:fs";
import path from "node:path";
import { findUp } from "find-up";

import {
  WORKSPACE_DIR_ENV_VAR,
  WORKSPACE_MANIFEST_FILENAME,
} from "./constants";

export function filter_public_env(
  env: Record<string, string>,
  { prefixs }: { prefixs: string[] },
) {
  return Object.fromEntries(
    Object.entries(env).filter(([k]) => {
      const prefix = prefixs.find((prefix) => k.startsWith(prefix));
      return prefix && k.startsWith(prefix);
    }),
  );
}

export function filter_private_env(
  env: Record<string, string>,
  { prefixs }: { prefixs: string[] },
) {
  return Object.fromEntries(
    Object.entries(env).filter(([k]) => {
      const prefix = prefixs.find((prefix) => k.startsWith(prefix));
      return !prefix || !k.startsWith(prefix);
    }),
  );
}

const previous_contents = new Map<string, string>();

export function write_if_changed(file: string, code: string) {
  if (code !== previous_contents.get(file)) {
    write(file, code);
  }
}

export function mkdirp(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    // @ts-expect-error EEXIST is a valid error
    if (e.code === "EEXIST") return;
    throw e;
  }
}

export function write(file: string, code: string) {
  previous_contents.set(file, code);
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, code);
}

const dedent_map = new WeakMap<
  TemplateStringsArray,
  {
    strings: string[];
    indents: string[];
  }
>();

export function dedent(strings: TemplateStringsArray, ...values: unknown[]) {
  let dedented = dedent_map.get(strings);

  if (!dedented) {
    const indentation = /\n?([ \t]*)/.exec(strings[0])?.[1];
    const pattern = new RegExp(`^${indentation}`, "gm");

    dedented = {
      strings: strings.map((str) => str.replace(pattern, "")),
      indents: [],
    };

    let current = "\n";

    for (let i = 0; i < values.length; i += 1) {
      const string = dedented.strings[i];
      const match = /\n([ \t]*)$/.exec(string);

      if (match) current = match[0];
      dedented.indents[i] = current;
    }

    dedent_map.set(strings, dedented);
  }

  let str = dedented.strings[0];
  for (let i = 0; i < values.length; i += 1) {
    str +=
      String(values[i]).replace(/\n/g, dedented.indents[i]) +
      dedented.strings[i + 1];
  }

  str = str.trim();

  return str;
}

export const isExistsDotEnvFile = (value: string) => {
  return fs.existsSync(path.resolve(value, ".env"));
};

export async function findWorkspaceDir(
  cwd: string,
): Promise<string | undefined> {
  const workspaceManifestDirEnvVar =
    process.env[WORKSPACE_DIR_ENV_VAR] ??
    process.env[WORKSPACE_DIR_ENV_VAR.toLowerCase()];
  const workspaceManifestLocation = workspaceManifestDirEnvVar
    ? path.join(workspaceManifestDirEnvVar, "pnpm-workspace.yaml")
    : await findUp([WORKSPACE_MANIFEST_FILENAME, "pnpm-workspace.yml"], {
        cwd: await getRealPath(cwd),
      });
  if (workspaceManifestLocation?.endsWith(".yml")) {
    const error = new Error();
    error.name = "BAD_WORKSPACE_MANIFEST_NAME";
    error.message = `The workspace manifest file should be named "pnpm-workspace.yaml". File found: ${workspaceManifestLocation}`;
    throw error;
  }
  return workspaceManifestLocation && path.dirname(workspaceManifestLocation);
}

export async function getRealPath(path: string): Promise<string> {
  return new Promise<string>((resolve) => {
    // We need to resolve the real native path for case-insensitive file systems.
    // For example, we can access file as C:\Code\Project as well as c:\code\projects
    // Without this we can face a problem when try to install packages with -w flag,
    // when root dir is using c:\code\projects but packages were found by C:\Code\Project
    fs.realpath.native(path, function (err, resolvedPath) {
      resolve(err !== null ? path : resolvedPath);
    });
  });
}
