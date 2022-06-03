exports.plugins = {
  plugins: [
    // @@@ global code scope
    { src: '~/plugins/initial-code/ssr-register' },
    { src: '~/plugins/initial-code/nossr-register', mode: 'client' },
    // @@@ vue-extend
    { src: '~/plugins/vue-extend/mixins/global.js' },
    { src: '~/plugins/vue-extend/directives/index.js' },
    // @@@ real plugins
    { src: '~/plugins/axios' },
    { src: '~/plugins/i18n.js' },
    { src: '~/plugins/recaptcha.js', mode: 'client' },
    { src: '~/plugins/vue-matomo.js', mode: 'client' },
    { src: '~/plugins/fb-sdk.js', mode: 'client' },
    { src: '~/plugins/google-sdk.js', mode: 'client' },
    { src: '~/plugins/notifications.js', mode: 'client' },
    { src: '~/plugins/notify-helper.js', mode: 'client' },
    { src: '~/plugins/modernizr.js', mode: 'client' },
    { src: '~/plugins/vue-infinite-loading.js', mode: 'client' },
    { src: '~/plugins/websocket.js', mode: 'client' },
    { src: '~/plugins/text-highlight.js', mode: 'client' }
  ],
  /* Nuxt.js dev-modules */
  buildModules: ['@nuxt/typescript-build'],
  /* Nuxt.js modules */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // '@nuxtjs/dotenv',
    /** Dotenv with merge env */
    '@wilonth/nuxt-dotenv',
    '@nuxtjs/style-resources'
  ]
}
