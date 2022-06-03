/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import Vue from 'vue'
import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import { Api } from '@/api.config'
const isProd = process.env.NODE_ENV === 'production'

export const mt = {
  SET_TRANSLATIONS: 'SET_TRANSLATIONS'
}

export const state = () => ({
  locale: process.env.BASIC_LANG,
  translations: null as any
})

export const strict = false
export type Translations = ReturnType<typeof state>
export const mutations: MutationTree<Translations> = {
  [mt.SET_TRANSLATIONS](state, value) {
    state.translations = value
    ;(this as any).$pluginI18n.setLocaleMessage(state.locale, value)
  }
}

export const actions: ActionTree<Translations, RootState> = {
  async syncTranslations({ dispatch }) {
    try {
      await this.$axios.post(
        process.env.SITE_URL + `/api/v1/sync/translations`,
        null,
        {
          headers: {
            Authorization: 'Basic ZGV2OmRlbGw='
          }
        }
      )
      Vue.notification.success(`update`)
      dispatch('getAll')
    } catch (e) {
      console.log(e.message)
      Vue.notification.error(`smth`)
    }
  },
  async syncImages({ dispatch }) {
    try {
      await this.$axios.post(
        process.env.SITE_URL + `/api/v1/sync/images`,
        null,
        {
          headers: {
            Authorization: 'Basic ZGV2OmRlbGw='
          }
        }
      )
      Vue.notification.success(`update`)
      dispatch('getAll')
    } catch (e) {
      console.log(e.message)
      Vue.notification.error(`smth`)
    }
  },
  async getAll({ commit }) {
    const isProd = process.env.NODE_ENV === 'production'
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)

    // process.env.PROD_API + Api.client.TRANSLATION_ALL
    // process.env.PROD_API + Api.client.IMAGE_ALL

    const [translations, images] = await Promise.all([
      this.$axios
        .get(
          isProd
            ? process.env.SITE_URL + `/translations.json`
            : process.env.SITE_URL + `/translations.json`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Authorization: 'Basic ZGV2OmRlbGw='
            }
          }
        )
        .then((i) => i.data)
        .catch((e) => {
          console.error('STORE_TRANSLATION', e.message)
        }),
      this.$axios
        .get(
          isProd
            ? process.env.SITE_URL + `/images.json`
            : process.env.SITE_URL + `/images.json`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Authorization: 'Basic ZGV2OmRlbGw='
            }
          }
        )
        .then((i) => i.data)
        .catch((e) => {
          console.error('STORE_TRANSLATION', e.message)
        })
    ])

    /** translations -> all front text stored to i18n */
    /** images -> all front images stored to i18n with @$t key */
    commit(mt.SET_TRANSLATIONS, Object.freeze({ ...translations, $i: images }))
  }
}
