module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint-config-react-app', 'prettier'],
  plugins: ['react', 'prettier', 'jsx-a11y', 'eslint-plugin-no-inline-styles'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'jsx-a11y/no-access-key': 'error',
    'no-multi-spaces': ['error'],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_', // Ignore variables that start with an underscore
        argsIgnorePattern: '^', // Ignore no use argument of function.
      },
    ],
    'react-hooks/exhaustive-deps': ['off'],
    'import/no-anonymous-default-export': ['off'],
    'jsx-a11y/alt-text': ['off'],
    'no-useless-escape': ['off'],
    'react-hooks/rules-of-hooks': ['off'],
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-underscore-dangle': ['warn', { enforceInMethodNames: true }],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        trailingComma: 'es5',
        endOfLine: 'lf',
        tabWidth: 2,
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: false,
        bracketSpacing: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
        proseWrap: 'always',
        quoteProps: 'as-needed',
        plugins: ['@trivago/prettier-plugin-sort-imports'],
        importOrder: [
          '^react(.*)$',
          '<THIRD_PARTY_MODULES>',
          '@/components(.*)$',
          '@/pages(.*)$',
          '@/(assets|config|constants|hooks|routes|utils)(.*)$',
          '@/(.*)$',
          '^[./]',
        ],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        importOrderCaseInsensitive: true,
        importOrderParserPlugins: ['jsx', 'decorators-legacy'],
      },
    ],
    'react/display-name': 'off',
    'react/jsx-boolean-value': 'error',
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    'react/self-closing-comp': 'error',
    'no-inline-styles/no-inline-styles': 2,
    eqeqeq: 'error',
    radix: 'error',
  },
};
