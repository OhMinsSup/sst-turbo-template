const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');
const { defaultRules, importResolver, ignorePatterns } = require('./share.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/react',
    '@vercel/style-guide/eslint/next',
    'eslint-config-turbo',
  ].map(require.resolve),
  root: true,
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    'import/resolver': importResolver(project),
  },
  ignorePatterns,
  rules: defaultRules,
  reportUnusedDisableDirectives: true,
};
