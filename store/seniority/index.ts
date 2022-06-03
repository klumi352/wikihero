/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import cd from 'lodash/cloneDeep'
import { RootState } from '~/store'
import { Api } from '@/api.config'

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  SET_INITIAL_SENIORITY = 'SET_INITIAL_SENIORITY',
  SET_SENIORITY = 'SET_SENIORITY',
  HANDLE_SENIORITY_INPUT = 'HANDLE_SENIORITY_INPUT'
}

export enum ActionsList {
  STORE = 'STORE',
  DELETE = 'DELETE',
  FIND = 'FIND',
  PUT = 'PUT'
}

export const getInitialSeniority = () => ({
  name: ''
})

export const state = () => ({
  errors: {} as any,
  form: getInitialSeniority() as any,
  seniority: getInitialSeniority() as any
})

export const strict = false
export type Seniority = ReturnType<typeof state>

export const mutations: MutationTree<Seniority> = {
  /**
   * FORMS */
  [MutationsList.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [MutationsList.SET_INITIAL_SENIORITY](state) {
    state.form = getInitialSeniority()
  },
  [MutationsList.SET_SENIORITY](state, value) {
    state.seniority = value
  },
  [MutationsList.HANDLE_SENIORITY_INPUT]: (state, { name, value }) => {
    Vue.set(state.seniority, name, value)
  }
}

export const actions: ActionTree<Seniority, RootState> = {
  /**
   * Store */
  async [ActionsList.STORE]({ state, commit, rootGetters }) {
    try {
      await this.$axios.post(
        Api[rootGetters['auth/isAdmin'] ? 'new' : 'new'].SET_NEW_SENIORITY,
        state.form
      )
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_SENIORITY)
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  },
  /**
   * Find */
  async [ActionsList.FIND]({ commit }, { slug, isAdmin } = {}) {
    try {
      commit(MutationsList.SET_INITIAL_SENIORITY)
      const { data } = await this.$axios.get(
        Api[isAdmin ? 'new' : 'new'].EDIT_SENIORITY(slug)
      )
      commit(MutationsList.SET_SENIORITY, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Put */
  async [ActionsList.PUT]({ state, commit }) {
    try {
      await this.$axios.put(
        Api.new.EDIT_SENIORITY(state.seniority.id),
        // format(state.hashtag, 'title', 'name')
        state.seniority
      )
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_SENIORITY)
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
      await this.$axios.delete(Api.new.DELETE_SENIORITY(id || state.form.id))
      Vue.notification.success('delete')
      commit(MutationsList.SET_INITIAL_SENIORITY)
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
