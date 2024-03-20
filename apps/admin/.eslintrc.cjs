const config = require('@tooling/eslint-config/next');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import/order': 'off',
    'react/jsx-pascal-case': 'off',
    'eslint-comments/require-description': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
};
