import { GENERATED_COMMENT } from "./constants";
import {
  create_import_meta_env,
  create_process_env,
  create_static_types,
} from "./generate";

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
