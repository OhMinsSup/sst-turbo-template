const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');
const { defaultRules, importResolver, ignorePatterns } = require('./share.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
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
};
