const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');
const { defaultRules, importResolver, ignorePatterns } = require('./share.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
    'eslint-config-turbo',
  ].map(require.resolve),
  root: true,
  parserOptions: {
    project,
  },
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': importResolver(project),
  },
  ignorePatterns,
  rules: defaultRules,
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
};
