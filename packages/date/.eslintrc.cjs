const config = require('@tooling/eslint-config/base.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import/order': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
  },
};
