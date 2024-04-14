const config = require('@tooling/eslint-config/react');
const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = Object.assign({}, config, {
  parserOptions: Object.assign({}, config.parserOptions, {
    project,
  }),
});
