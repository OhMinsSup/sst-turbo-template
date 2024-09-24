import baseConfig, { restrictEnvAccess } from "@template/eslint-config/base";
import jsxA11yConfig from "@template/eslint-config/jsx-a11y";
import reactConfig from "@template/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["!**/.server", "!**/.client"],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
  ...jsxA11yConfig,
  {
    settings: {
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
      "import/resolver": {
        typescript: {},
      },
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "no-restricted-properties": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
];
