export const DEFAULT_PROCESS_ENV_PREFIX = "";

export const valid_identifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

export const GENERATED_COMMENT = "// this file is generated — do not edit it\n";

export const WORKSPACE_DIR_ENV_VAR = "NPM_CONFIG_WORKSPACE_DIR";
export const WORKSPACE_MANIFEST_FILENAME = "pnpm-workspace.yaml";

export const reserved = new Set([
  "do",
  "if",
  "in",
  "for",
  "let",
  "new",
  "try",
  "var",
  "case",
  "else",
  "enum",
  "eval",
  "null",
  "this",
  "true",
  "void",
  "with",
  "await",
  "break",
  "catch",
  "class",
  "const",
  "false",
  "super",
  "throw",
  "while",
  "yield",
  "delete",
  "export",
  "import",
  "public",
  "return",
  "static",
  "switch",
  "typeof",
  "default",
  "extends",
  "finally",
  "package",
  "private",
  "continue",
  "debugger",
  "function",
  "arguments",
  "interface",
  "protected",
  "implements",
  "instanceof",
]);
