module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022
  },
  extends: [
    'airbnb/base',
    'plugin:node/recommended'
  ],
  rules: {
    'max-len': 0,
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'import-name': 0,
    'object-literal-sort-keys': 0,
    'prefer-array-literal': 0,
    'no-increment-decrement': 0,
    'max-classes-per-file': 0,
    align: 0,
    'no-boolean-literal-compare': 0,
    'no-unused-vars': 2,
    'no-submodule-imports': 0,
    'import/extensions': 0,
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-missing-import': 0,
    'import/no-unresolved': 0,
    'node/process-exit-as-throw': 0,
    'no-process-exit': 0,
    'no-extra-semi': 0,
    'node/no-unpublished-import': 0,
    'no-empty': 0,
    'consistent-return': 0,
    'no-await-in-loop': 0,
    'no-continue': 0,
    'no-restricted-syntax': 0,
    'import/prefer-default-export': 1,
    'implicit-arrow-linebreak': 0,
    'class-methods-use-this': 0,
    'no-promise-executor-return': 0,
    'operator-linebreak': 0,
    'no-nested-ternary': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'no-bitwise': 0,
    'no-console': 0,
    'no-throw-literal': 0,
    'import/no-relative-packages': 0,
    'node/shebang': 0
  }
};
