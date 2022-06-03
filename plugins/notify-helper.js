/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'

export default function({ app }) {
  const pluginName = 'notification'
  const i18n = app.i18n

  const TRANSLATION_MODULE = 'log'

  const notify = {
    _show: (type, text) => {
      Vue.notify({
        type,
        ignoreDuplicates: true,
        title: i18n.t(`${TRANSLATION_MODULE}.${type}`),
        text: text ? i18n.t(`${TRANSLATION_MODULE}.${type}-${text}`) : undefined
      })
    },
    success(text) {
      this._show('success', text)
    },
    error(text) {
      this._show('error', text)
    }
  }

  Vue.prototype['$' + pluginName] = notify
  Vue[pluginName] = notify
}
