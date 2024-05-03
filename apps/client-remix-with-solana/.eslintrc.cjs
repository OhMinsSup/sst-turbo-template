const config = require('@tooling/eslint-config/remix');
const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = Object.assign({}, config, {
  parserOptions: Object.assign({}, config.parserOptions, {
    project,
  }),
  rules: Object.assign({}, config.rules, {
    'unicorn/filename-case': 'off',
    'react/jsx-pascal-case': 'off',
    'eslint-comments/require-description': 'off',
  }),
});
