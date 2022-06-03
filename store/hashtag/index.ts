/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import cd from 'lodash/cloneDeep'
import { RootState } from '~/store'
import { Api } from '@/api.config'

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  SET_INITIAL_HASHTAG = 'SET_INITIAL_HASHTAG',
  SET_HASHTAG = 'SET_HASHTAG',
  HANDLE_HASHTAG_INPUT = 'HANDLE_HASHTAG_INPUT'
}

export enum ActionsList {
  STORE = 'STORE',
  DELETE = 'DELETE',
  FIND = 'FIND',
  PUT = 'PUT'
}

export const getInitialHashtag = () => ({
  title: '',
  description: ''
})

export const state = () => ({
  errors: {} as any,
  form: getInitialHashtag() as any,
  hashtag: getInitialHashtag() as any
})

export const strict = false
export type Hashtag = ReturnType<typeof state>

export const mutations: MutationTree<Hashtag> = {
  /**
   * FORMS */
  [MutationsList.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [MutationsList.SET_INITIAL_HASHTAG](state) {
    state.form = getInitialHashtag()
  },
  [MutationsList.SET_HASHTAG](state, value) {
    state.hashtag = value
  },
  [MutationsList.HANDLE_HASHTAG_INPUT]: (state, { name, value }) => {
    Vue.set(state.hashtag, name, value)
  }
}

export const actions: ActionTree<Hashtag, RootState> = {
  /**
   * Store */
  async [ActionsList.STORE]({ state, commit, rootGetters }) {
    try {
      await this.$axios.post(
        Api[rootGetters['auth/isAdmin'] ? 'new' : 'new'].SET_NEW_HASHTAG,
        state.form
      )
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_HASHTAG)
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  },
  /**
   * Find */
  async [ActionsList.FIND]({ commit }, { slug, isAdmin } = {}) {
    try {
      commit(MutationsList.SET_INITIAL_HASHTAG)
      const { data } = await this.$axios.get(
        Api[isAdmin ? 'new' : 'new'].EDIT_HASHTAG(slug)
      )
      commit(MutationsList.SET_HASHTAG, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Put */
  async [ActionsList.PUT]({ state, commit }) {
    try {
      await this.$axios.put(
        Api.new.EDIT_HASHTAG(state.hashtag.id),
        // format(state.hashtag, 'title', 'name')
        state.hashtag
      )
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_HASHTAG)
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  },
  /**
   * Delete */
  async [ActionsList.DELETE]({ state, commit }, { id } = {}) {
    const vm = this as any

    try {
      if (!confirm(vm.app.i18n.t('modal.are-you-sure'))) return
      //
      await this.$axios.delete(Api.new.DELETE_HASHTAG(id || state.form.id))
      Vue.notification.success('delete')
      commit(MutationsList.SET_INITIAL_HASHTAG)
    } catch (e) {
      Vue.notification.error('delete')
      throw e
    }
  }
}

// @ts-ignore
function format(data, name, prevName) {
  return Object.assign({}, data, {
    [name]: data[prevName]
  })
}
