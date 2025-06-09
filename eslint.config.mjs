import pluginCypress from 'eslint-plugin-cypress'

export default [
  pluginCypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    rules: {
      // You can customize rules here
      'cypress/no-unnecessary-waiting': 'warn', // Changed from error to warning
      'cypress/unsafe-to-chain-command': 'error',
      'cypress/no-force': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
      'no-unused-vars': 'warn',
      'semi': ['error', 'always']
    }
  }
] 