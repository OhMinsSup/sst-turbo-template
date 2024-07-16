import { fileURLToPath } from "node:url";

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-svelte",
  ],
  tailwindConfig: fileURLToPath(
    new URL("../../tooling/tailwind/web.ts", import.meta.url),
  ),
  tailwindFunctions: ["cn", "cva"],
  importOrder: [
    "<TYPES>",
    "^(@sveltejs/(.*)$)|^(@sveltejs$)",
    "^(svelte/(.*)$)|^(svelte$)",
    "^($app/(.*)$)|^($app$)",
    "^($lib/(.*)$)|^($lib$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@template",
    "^@template/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};

export default config;
