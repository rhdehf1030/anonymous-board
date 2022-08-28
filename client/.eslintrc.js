module.exports = {
  parser: 'vue-eslint-parser',
  extends: ['standard', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extends: ['plugin:@typescript-eslint/eslint-recommended']
  },
  rules: {
    'func-call-spacing': 'off'
  }
}
