const config = require('@tooling/eslint-config/next');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    "eslint-comments/require-description": "off",
  },
};
