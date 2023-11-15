/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "project": "./tsconfig.json",
    "ecmaVersion": 2024,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  plugins: ['@typescript-eslint', 'functional'],
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:functional/external-typescript-recommended',
    'plugin:functional/recommended',
    'plugin:functional/lite',
    'plugin:functional/no-exceptions',
    'plugin:functional/no-mutations',
    'plugin:functional/no-other-paradigms',
    'plugin:functional/stylistic'
  ],
  rules: {
    'no-console': 'off',
    'no-eval': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/array-type': [
      'warn',
      {
        default: 'generic'
      }
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true
      }
    ],
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/space-infix-ops': 'error',
    'functional/no-let': 'warn',
    //'functional/no-mixed-types': 'off',
    'functional/no-return-void': 'off',
    'functional/immutable-data': 'warn',
    'functional/functional-parameters': 'warn',
    'functional/prefer-immutable-types': 'warn',
    //'functional/prefer-readonly-type': 'warn',
    //'functional/readonly-type': 'warn'
  }
}
