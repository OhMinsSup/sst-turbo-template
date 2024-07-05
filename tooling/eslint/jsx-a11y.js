// @ts-ignore - This file is not a module
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
    },
  },
];
