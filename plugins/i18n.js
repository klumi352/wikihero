import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
Vue.config.disableNoTranslationWarning = false

export default ({ app, store }, inject) => {
  const { locale } = store.state.translations
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  const i18n = new VueI18n({
    locale,
    silentTranslationWarn: true,
    fallbackLocale: process.env.BASIC_LANG,
    messages: {
      // setting in ssr is translation vuex module
      [locale]: process.client ? store.state.translations.translations : null
    }
  })

  inject('pluginI18n', i18n)
  app.i18n = i18n
  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${app.i18n.locale}/${link}`
  }
}
