import baseConfig, { restrictEnvAccess } from "@template/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...restrictEnvAccess,
  {
    rules: {
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
    },
  },
];
