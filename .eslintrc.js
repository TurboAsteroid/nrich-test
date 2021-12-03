module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'jest',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    'jest/globals': true
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'no-continue': 'off',
    'max-len': [
      'error',
      {
        'code': 120,
        'tabWidth': 2,
        'ignoreComments': true,
        'ignoreTemplateLiterals': true,
        'ignoreStrings': true,
      }
    ],
    'arrow-parens': [
      'error',
      'always',
    ],
    'implicit-arrow-linebreak': 0,
    'object-curly-spacing': ['error', 'always'],
    'jest/no-disabled-tests': 'warn',
    "jest/no-focused-tests": 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  },
};
