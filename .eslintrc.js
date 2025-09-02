const noCdsRunRule = require('./eslint-rules/no-cds-run');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-cds-run': 'error',
  },
  plugins: [],
  overrides: [],
  // Add your custom rule manually
  globals: {},
  settings: {},
  // Connect the rule
  ...{
    rules: {
      'no-cds-run': 'error',
    },
    // Use a workaround: define rules inline
    // ESLint doesn't normally support custom rules this way, but it works for testing
    overrides: [
      {
        files: ['*.js', '*.ts'],
        rules: {
          'no-cds-run': 'error',
        },
      },
    ],
  },
};

require('eslint').linter.defineRule('no-cds-run', noCdsRunRule);
