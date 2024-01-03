const config = require('@template/lintconfig/eslint-react');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'func-names': 'off',
    'unicorn/filename-case': 'off',
    'eslint-comments/require-description': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
