const config = require('@template/lintconfig/eslint-next');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'tsdoc/syntax': 'off',
    'func-names': 'off',
    'unicorn/filename-case': 'off',
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'react/jsx-pascal-case': 'off',
    'import/no-named-as-default': 'off',
    'eslint-comments/require-description': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
  },
};
