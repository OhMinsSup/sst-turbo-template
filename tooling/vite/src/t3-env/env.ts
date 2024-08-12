import path from "node:path";
import { loadEnv, normalizePath } from "vite";

import {
  filter_private_env,
  filter_public_env,
  findWorkspaceDir,
  isExistsDotEnvFile,
} from "./utils";

interface GetEnvDirParams {
  resolvedRoot: string;
  viteConfigEnvDir?: string;
  userConfigEnvFile?: string;
}

export const get_env_dir = async ({
  resolvedRoot,
  userConfigEnvFile,
  viteConfigEnvDir,
}: GetEnvDirParams) => {
  // 사용자가 정의한 envFile이 있으면 해당 파일의 디렉토리를 사용
  if (userConfigEnvFile) {
    return path.resolve(resolvedRoot, path.dirname(userConfigEnvFile));
  }

  // vite.config.ts에 envDir가 정의되어 있으면 해당 디렉토리를 사용
  if (viteConfigEnvDir) {
    return normalizePath(path.resolve(resolvedRoot, viteConfigEnvDir));
  }

  // 현재 디렉토리에 .env 파일이 존재하면 현재 디렉토리를 사용
  if (isExistsDotEnvFile(resolvedRoot)) {
    return resolvedRoot;
  }

  // .env 파일이 존재하지 않으면 workspace 디렉토리를 찾아서 사용
  const workspaceDir = await findWorkspaceDir(resolvedRoot);
  if (workspaceDir && isExistsDotEnvFile(workspaceDir)) {
    return workspaceDir;
  }

  throw new Error(
    `The .env file does not exist in the root directory: ${resolvedRoot}`,
  );
};

interface GetEnvPrefixParams {
  userConfigPrefix?: string | string[];
  viteConfigEnvPrefix?: string | string[];
}

export const get_env_prefix = ({
  userConfigPrefix,
  viteConfigEnvPrefix,
}: GetEnvPrefixParams) => {
  const prefixs = new Set<string>();

  if (userConfigPrefix) {
    if (Array.isArray(userConfigPrefix)) {
      userConfigPrefix.forEach((prefix) => prefixs.add(prefix));
    } else {
      prefixs.add(userConfigPrefix);
    }
  }

  if (viteConfigEnvPrefix) {
    if (Array.isArray(viteConfigEnvPrefix)) {
      viteConfigEnvPrefix.forEach((prefix) => prefixs.add(prefix));
    } else {
      prefixs.add(viteConfigEnvPrefix);
    }
  }

  return Array.from(prefixs);
};

export interface GetEnvConfigParams {
  envDir: string;
  prefixs: string[];
}

export const get_env = (config: GetEnvConfigParams, mode: string) => {
  const env = loadEnv(mode, config.envDir, "");

  return {
    public: filter_public_env(env, { prefixs: config.prefixs }),
    private: filter_private_env(env, { prefixs: config.prefixs }),
  };
};
