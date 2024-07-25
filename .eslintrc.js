module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  // extends: ['eslint-config-react-app'],
  extends: ['eslint-config-react-app', 'prettier'],
  plugins: ['react', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    quotes: ['error', 'single'],
    // we want to force semicolons
    semi: ['error', 'always'],
    // we use 2 spaces to indent our code
    indent: ['error', 2, { SwitchCase: 1 }],
    // we want to avoid extraneous spaces
    'no-multi-spaces': ['error'],
    'no-unused-vars': ['off'],
    'react-hooks/exhaustive-deps': ['off'],
    'import/no-anonymous-default-export': ['off'],
    'jsx-a11y/alt-text': ['off'],
    'no-useless-escape': ['off'],
    'react-hooks/rules-of-hooks': ['off'],
  }
};
