module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    node: true,
    webextensions: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    'no-param-reassign': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': [
      'error',
      {
        code: 2000,
        tabWidth: 2,
      },
    ],
    'semi-style': 0,
    'function-paren-newline': 0,
    'class-methods-use-this': 0,
    'object-curly-newline': 0,
  },
};
