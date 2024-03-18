const config = require('@tooling/eslint-config/next');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import/order': 'off',
    'eslint-comments/require-description': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
};
