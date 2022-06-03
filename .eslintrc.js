module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'promise/param-names': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    camelcase: 'off',
    'vue/require-default-prop': 'off',
    'no-undef': 'off'
  }
}
