/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  plugins: ['prettier', 'import'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['node_modules'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'import/no-unresolved': 'error',
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/no-children-prop': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unstable-nested-components': 'off',
    eqeqeq: 'error',
    'import/order': [
      'WARN',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            message: 'Usage of relative parent imports is not allowed.',
          },
        ],
      },
    ],
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.tsx', '.ts'],
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
};
