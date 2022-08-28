module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    strictPropertyInitialization: 'off',
    'no-useless-constructor': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never']
  }
}
