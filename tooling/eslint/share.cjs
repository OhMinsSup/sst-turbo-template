const ignorePatterns = [
  '**/*.config.js',
  '**/*.config.cjs',
  '**/*.config.mjs',
  '**/.eslintrc.cjs',
  '**/.eslintrc.js',
  '**/.eslintrc.mjs',
  '.next',
  '.sst',
  'dist',
  'build',
  'pnpm-lock.yaml',
  'node_modules',
];

const importResolver = (project) => {
  return {
    typescript: {
      project,
    },
    node: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
    },
  };
};

const defaultRules = {
  'import/order': 'off',
  'import/no-default-export': 'off',
  'import/no-named-as-default-member': 'off',
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
};

module.exports = {
  ignorePatterns,
  importResolver,
  defaultRules,
};
