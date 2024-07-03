import baseConfig, { restrictEnvAccess } from "@template/eslint-config/base";
import nextjsConfig from "@template/eslint-config/nextjs";
import reactConfig from "@template/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
  {
    rules: {
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
    },
  },
];
