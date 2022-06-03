/* eslint-disable camelcase */
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'

/** helpers */
import isArray from 'lodash/isArray'
import cd from 'lodash/cloneDeep'
import { Protect, User } from './-types'
import { poll } from '@/helpers'
import { Api } from '@/api.config'
import { RootState } from '~/store'
const Cookie = process.client ? require('js-cookie') : undefined

export const getUserId = (user: any) =>
  `${user.id} / ${user.email || user.name}`

export const mt = {
  MISSED_POSTS: 'MISSED_POSTS',
  /** LOADING */
  SET_LOADING: 'SET_LOADING',
  /** AUTH */
  SET_PROTECTED_API_KEYS: 'SET_PROTECTED_API_KEYS',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_USER_LEVEL: 'SET_USER_LEVEL',
  CLEAR_PROTECTED_API_KEYS: 'CLEAR_PROTECTED_API_KEYS',
  CLEAR_USER_INFO: 'CLEAR_USER_INFO',
  /** FORMS */
  CLEAR_FORM_INPUT: 'CLEAR_FORM_INPUT',
  CLEAR_FORM_ERROR: 'CLEAR_FORM_ERROR',
  SET_FORM_ERROR: 'SET_FORM_ERROR',
  HANDLE_FORM_INPUT: 'HANDLE_FORM_INPUT'
}

export const state = () => ({
  missed_posts: 0,
  loading: false as boolean,
  form: {} as any,
  protect: null as Protect | null,
  user: null as User | null,
  level: null as any,
  errors: { user: {} } as any
})

export const strict = false
export type Auth = ReturnType<typeof state>
export const getters: GetterTree<Auth, RootState> = {
  isLevelUp: (state) =>
    Number(state.level?.total) - Number(state.level?.count_points) <
    Number(state.level?.point_from),
  isLevelUpMod: (state) =>
    Number(state.level?.total_points) - Number(state.level?.count_points) <
    Number(state.level?.point_from),
  loggedInNoConfirm: (state) =>
    Boolean(state.user?.temp_user === 0 && !state.user?.email_verified_at),
  loggedIn: (state) =>
    Boolean(!state.user?.temp_user && state.user?.email_verified_at),
  userEmail: (state) => state.user?.email,
  isAdmin: (state) =>
    Boolean(
      !state.user?.temp_user &&
        state.user?.user_roles === 'admin' &&
        state.user?.email_verified_at
    ),
  tempUser: (state) => Boolean(state.user?.temp_user)
}

export const mutations: MutationTree<Auth> = {
  [mt.MISSED_POSTS](state, payload) {
    state.missed_posts = payload
  },
  /**
   * LOADING */
  [mt.SET_LOADING]: (state, loading) => {
    state.loading = loading
  },
  /**
   * PROTECTED KEYS */
  [mt.SET_PROTECTED_API_KEYS]: (state, protect) => {
    state.protect = protect
    if (process.client) {
      Object.keys(protect).forEach((key) => {
        Cookie.set(`${process.env.COOKIE_PREFIX}${key}`, protect[key])
      })
    }
  },
  [mt.CLEAR_PROTECTED_API_KEYS]: (state) => {
    if (process.client) {
      Object.keys(state.protect as Protect).forEach((key) => {
        Cookie.remove(`${process.env.COOKIE_PREFIX}${key}`, { path: '' })
      })
    }
    state.protect = null
  },
  /**
   * USER_INFO */
  [mt.SET_USER_INFO]: (state, value) => {
    state.user = value
  },
  [mt.SET_USER_LEVEL]: (state, value) => {
    state.level = Object({
      ...(value?.level || {}),
      ...(value?.pointOperation || {})
    })
  },
  [mt.CLEAR_USER_INFO]: (state) => {
    state.user = null
    state.level = null
  },
  /**
   * FORMS */
  [mt.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [mt.SET_FORM_ERROR]: (state, payload) => {
    Object.keys(payload).forEach((key) => {
      Vue.set(
        state.errors.user,
        key,
        isArray(payload[key]) ? payload[key].join(' ') : payload[key]
      )
    })
  },
  [mt.CLEAR_FORM_INPUT]: (state) => {
    state.form = {}
  },
  [mt.CLEAR_FORM_ERROR]: (state) => {
    Object.keys(state.errors.user).forEach((key) => {
      Vue.set(state.errors.user, key, '')
    })
  }
}

export const actions: ActionTree<Auth, RootState> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showNotConfirmModal({ state, getters }, { closeAction } = {}) {
    const vm = this as any

    if (getters.loggedInNoConfirm) {
      return new Promise<void>((resolve) => {
        poll(
          () => Vue.$showPrompt,
          () => {
            Vue.$showPrompt({
              closeAction,
              textModal: true,
              intro: vm.app.i18n.t('modal-no-confirm.head', {
                username: state.user?.name,
                useremail: `<a class="g-link" href="mailto:${state.user?.email}">${state.user?.email}</a>`
              })
            })
            resolve()
          }
        )
      })
    }

    return Promise.resolve()
  },
  updateAxiosConfig({ state }, { setToken = true } = {}) {
    const token = (<any>state.protect)?.access_token
    return new Promise<void>((resolve) => {
      if (setToken) {
        this.$axios.setToken(token || false, 'Bearer')
      } else {
        this.$axios.setToken(false, 'Bearer')
      }
      resolve()
    })
  },
  loading({ commit }, loading) {
    if (loading) commit(mt.SET_LOADING, true)
    else setTimeout(() => commit(mt.SET_LOADING, false), 500)
  },
  createTempUser({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios.post(Api.client.CTEARE_TEMP_USER).then(({ data }: any) => {
        commit(mt.SET_USER_INFO, cd(data))
        commit(mt.SET_USER_LEVEL, cd(data.points))
        commit(mt.SET_PROTECTED_API_KEYS, cd(data.content))
        dispatch('updateAxiosConfig', cd(data.content)).then(() => {
          resolve(cd(data.content))
        })
      }, reject)
    })
  },
  me({ commit }) {
    return new Promise<void>((resolve, reject) => {
      this.$axios.get(Api.client.AUTH_ME).then(({ data }: any) => {
        commit(mt.SET_USER_INFO, cd(data))
        commit(mt.SET_USER_LEVEL, cd(data.points.points))
        commit(mt.SET_PROTECTED_API_KEYS, cd(data.content))
        resolve()
      }, reject)
    })
  },
  facebookLogout({ commit }) {
    return new Promise<void>((resolve) => {
      try {
        // Vue.FB.logout(resolve)
        Vue.FB.getLoginStatus(function(response: any) {
          if (response && response.status === 'connected') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Vue.FB.logout(function(response: any) {
              document.location.reload()
              resolve(response)
            })
          }
          commit(mt.MISSED_POSTS, 0)
        })
      } catch (e) {
      } finally {
        resolve()
      }
    })
  },
  async logout({ commit, dispatch }) {
    try {
      await dispatch('facebookLogout')
      dispatch('loading', true)
      /** */
      Vue.notification.success('logout')

      await dispatch('updateAxiosConfig', { setToken: false })
      commit(mt.CLEAR_PROTECTED_API_KEYS)
      commit(mt.CLEAR_USER_INFO)
      await dispatch('createTempUser')
      dispatch('loading', false)
    } catch (e) {
      /** */
      Vue.notification.error('smth')
    } finally {
      /** only home redirect */
      const redirectPath = this.$router.currentRoute.path
      this.$router.push(`/` || `/login/?redirect=${redirectPath}`)
    }
  },
  async login(
    { commit, dispatch, state, getters },
    { provider: providerName, token } = {}
  ) {
    const provider = (() => {
      switch (providerName) {
        /** Google provider */
        case 'google':
          return {
            path: Api.client.LOGIN_GOOGLE,
            data: { token }
          }
        /** Facebook provider */
        case 'facebook':
          return {
            path: Api.client.LOGIN_FACEBOOK,
            data: { token }
          }
        /** Local provider */
        default:
          return {
            path: Api.client.LOGIN_LOCAL,
            data: state.form
          }
      }
    })()
    dispatch('loading', true)
    return await this.$axios
      .post(provider.path, provider.data)
      .then(
        async ({ data }: any) => {
          /** */
          Vue.notification.success('login')
          commit(mt.SET_USER_INFO, cd(data))
          commit(mt.SET_USER_LEVEL, cd(data.points.points))
          commit(mt.SET_PROTECTED_API_KEYS, cd(data.content))
          await dispatch('updateAxiosConfig', cd(data.content))
          await dispatch('fetchMissedPosts')
          commit(mt.CLEAR_FORM_INPUT)
          commit(mt.CLEAR_FORM_ERROR)

          if (getters.loggedInNoConfirm) {
            await dispatch('showNotConfirmModal', {
              closeAction: () => {
                this.$router.push(
                  (this.$router.currentRoute.query as any).redirect || '/'
                )
              }
            })
          } else {
            this.$router.push('/feed')
          }
          return data
        },
        (e) => {
          commit(mt.SET_FORM_ERROR, e.response.data.errors)
          if (e.response.data?.errors?.status) {
            Vue.notification.error('user-ban')
          }
        }
      )
      .finally(() => {
        dispatch('loading', false)
      })
  },
  register({ commit, dispatch, state }, { withClear } = {}) {
    const data = new FormData()
    for (const i in state.form) {
      data.append(i, state.form[i])
    }
    return this.$axios.post(Api.client.REGISTRATION, data).then(
      async ({ data }: any) => {
        commit(mt.SET_USER_INFO, cd(data))
        commit(mt.SET_USER_LEVEL, cd(data.points))
        commit(mt.SET_PROTECTED_API_KEYS, cd(data.content))
        await dispatch('updateAxiosConfig', cd(data.content))
        if (withClear) {
          commit(mt.CLEAR_FORM_INPUT)
          commit(mt.CLEAR_FORM_ERROR)
        }
      },
      (e) => {
        commit(mt.SET_FORM_ERROR, e.response.data)
        throw e
      }
    )
  },
  async fetchMissedPosts({ commit }) {
    // @ts-ignore
    const { amount_posts } = await this.$axios.get(Api.client.MISSED_POSTS)
    commit(mt.MISSED_POSTS, amount_posts)
  }
}
