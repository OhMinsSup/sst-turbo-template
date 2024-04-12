const config = require('@tooling/eslint-config/react');
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
    'unicorn/filename-case': 'off',
    'import/order': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
