const config = require('@tooling/eslint-config/next');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'react/jsx-pascal-case': 'off',
    'eslint-comments/require-description': 'off',
  },
};
