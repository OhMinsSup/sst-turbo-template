const config = require('./base.cjs');
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
  },
};
