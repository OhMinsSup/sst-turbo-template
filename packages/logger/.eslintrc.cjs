const config = require('@tooling/eslint-config/base');
const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = Object.assign({}, config, {
  parserOptions: Object.assign({}, config.parserOptions, {
    project,
  }),
  rules: Object.assign({}, config.rules, {
    'no-bitwise': 'off',
    'no-console': 'off',
  }),
});
