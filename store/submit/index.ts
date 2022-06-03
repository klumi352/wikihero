/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'

/** helpers */
import isArray from 'lodash/isArray'
import { RootState } from '~/store'
// import cd from 'lodash/cloneDeep'

export const mt = {
  /** LOADING */
  SET_LOADING: 'SET_LOADING',
  /** FORMS */
  CLEAR_FORM_INPUT: 'CLEAR_FORM_INPUT',
  CLEAR_FORM_ERROR: 'CLEAR_FORM_ERROR',
  SET_FORM_ERROR: 'SET_FORM_ERROR',
  HANDLE_FORM_INPUT: 'HANDLE_FORM_INPUT'
}

export const state = () => ({
  loading: false as boolean,
  form: {} as any,
  errors: {} as any
})

export const strict = false
export type Submit = ReturnType<typeof state>
export const getters: GetterTree<Submit, RootState> = {
  //
}

export const mutations: MutationTree<Submit> = {
  /**
   * LOADING */
  [mt.SET_LOADING]: (state, loading) => {
    state.loading = loading
  },
  /**
   * FORMS */
  [mt.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [mt.SET_FORM_ERROR]: (state, payload) => {
    Object.keys(payload || {}).forEach((key) => {
      Vue.set(
        state.errors,
        key,
        isArray(payload[key]) ? payload[key].join(' ') : payload[key]
      )
    })
  },
  [mt.CLEAR_FORM_INPUT]: (state) => {
    state.form = {}
  },
  [mt.CLEAR_FORM_ERROR]: (state) => {
    Object.keys(state.errors).forEach((key) => {
      Vue.set(state.errors, key, '')
    })
  }
}

interface SendType {
  path: string
  withRecaptcha?: boolean
  method?: string
  asFormData: boolean
}

export const actions: ActionTree<Submit, RootState> = {
  async send(
    { commit, state },
    {
      path = '',
      method = 'post',
      asFormData = false,
      withRecaptcha = false
    }: SendType
  ) {
    let formdata: any
    if (asFormData) {
      formdata = new FormData()
      Object.keys(state.form || {}).forEach((key) => {
        formdata.append(key, state.form[key])
      })
    }

    let recaptcha: any
    if (withRecaptcha) {
      try {
        await Vue.prototype.$recaptchaLoaded()
        // Execute reCAPTCHA with action "login".
        recaptcha = await Vue.prototype.$recaptcha('login')
      } catch (e) {
        Vue.notification.error('recaptcha')
        // eslint-disable-next-line no-console
        console.error(e.message)
      } finally {
        if (asFormData) formdata.append('recaptcha', recaptcha)
      }
    }

    try {
      const result = await new Promise((resolve, reject) => {
        ;(this.$axios as any)
          [method](path, asFormData ? formdata : { ...state.form, recaptcha })
          .then(
            ({ data }: any) => {
              resolve(data)
            },
            (e: any) => {
              /** ? must to handle any server error (like cors, 500) */
              if (!e.response) reject(null)

              if (e.response.data?.recaptcha) {
                Vue.notification.error('recaptcha')
              }
              commit(mt.SET_FORM_ERROR, e.response.data?.errors)
              reject(e.response.data)
            }
          )
          .finally(() => {
            recaptcha = null
          })
      })
      return result
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e?.message)
      throw e
    }
  }
}
