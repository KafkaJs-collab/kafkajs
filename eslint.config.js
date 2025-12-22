const js = require('@eslint/js')
const prettierPlugin = require('eslint-plugin-prettier')
const nPlugin = require('eslint-plugin-n')
const jestPlugin = require('eslint-plugin-jest')
const importPlugin = require('eslint-plugin-import')
const promisePlugin = require('eslint-plugin-promise')

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'coverage/**', 'website/**'],
  },
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettierPlugin,
      n: nPlugin,
      jest: jestPlugin,
      import: importPlugin,
      promise: promisePlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        global: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-callback-literal': 'off',
      'no-unexpected-multiline': 'off',
      'no-return-await': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'n/no-deprecated-api': 'off',
      'n/no-missing-require': [
        'error',
        {
          allowModules: ['testHelpers'],
        },
      ],
      'no-process-exit': 'off',
      'n/shebang': 'off',
      camelcase: [
        'error',
        {
          allow: ['^testIfKafka_*'],
        },
      ],
      'jest/no-focused-tests': 'error',
      'jest/no-commented-out-tests': 'error',
      'jest/no-deprecated-functions': 'error',
      'jest/no-jasmine-globals': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
    },
  },
]
