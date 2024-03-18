const config = require('@tooling/eslint-config/react.cjs');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import/order': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
