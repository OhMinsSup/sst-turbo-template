const config = require('@tooling/eslint-config/base');
const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    project,
  },
  rules: {
    ...config.rules,
    'import/order': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
  },
};
