/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import cd from 'lodash/cloneDeep'
import isArray from 'lodash/isArray'
import { RootState } from '~/store'
import { Api } from '@/api.config'

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  SET_INITIAL_CATEGORY = 'SET_INITIAL_CATEGORY',
  SET_CATEGORY = 'SET_CATEGORY',
  HANDLE_CATEGORY_INPUT = 'HANDLE_CATEGORY_INPUT',
  PUSH_SELECTED_GROUPS = 'PUSH_SELECTED_GROUPS',
  SET_FORM_ERROR = 'SET_FORM_ERROR',
  CLEAR_FORM_ERROR = 'CLEAR_FORM_ERROR'
}

export enum ActionsList {
  STORE = 'STORE',
  DELETE = 'DELETE',
  FIND = 'FIND',
  PUT = 'PUT'
}

export const getInitialCategory = () => ({
  title: '',
  description: '',
  slug: '',
  groups: [],
  special: 0
})

export const state = () => ({
  errors: {} as any,
  form: getInitialCategory() as any,
  category: getInitialCategory() as any
})

export const strict = false
export type Category = ReturnType<typeof state>

export const getters: GetterTree<Category, RootState> = {
  getGroupsWithId: (state) =>
    state.category.groups.slice(0).map((i: any) => i.id)
}

export const mutations: MutationTree<Category> = {
  /**
   * FORMS */
  [MutationsList.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [MutationsList.SET_INITIAL_CATEGORY](state) {
    state.form = getInitialCategory()
  },
  [MutationsList.SET_CATEGORY](state, value) {
    state.category = value
  },
  [MutationsList.HANDLE_CATEGORY_INPUT]: (state, { name, value }) => {
    Vue.set(state.category, name, value)
  },
  [MutationsList.PUSH_SELECTED_GROUPS]: (state, value) => {
    state.form.groups.push(value)
  },
  [MutationsList.SET_FORM_ERROR]: (state, payload) => {
    Object.keys(payload).forEach((key) => {
      Vue.set(
        state.errors,
        key,
        isArray(payload[key]) ? payload[key].join(' ') : payload[key]
      )
    })
  },
  [MutationsList.CLEAR_FORM_ERROR]: (state) => {
    Object.keys(state.errors).forEach((key) => {
      Vue.set(state.errors, key, '')
    })
  }
}

export const actions: ActionTree<Category, RootState> = {
  /**
   * Store */
  async [ActionsList.STORE]({ state, commit, rootGetters }) {
    try {
      await this.$axios.post(
        Api[rootGetters['auth/isAdmin'] ? 'new' : 'new'].SET_NEW_CATEGORY,
        format(state.form, [
          //
          'groups',
          // @ts-ignore
          (x) => x.map((i) => i.id)
        ])
      )
      commit(MutationsList.SET_INITIAL_CATEGORY)
      commit(MutationsList.CLEAR_FORM_ERROR)
      Vue.notification.success('update')
    } catch (e) {
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
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
      await this.$axios.delete(Api.new.DELETE_CATEGORY(id || state.form.id))
      Vue.notification.success('delete')
      commit(MutationsList.SET_INITIAL_CATEGORY)
    } catch (e) {
      Vue.notification.error('delete')
      throw e
    }
  },
  /**
   * Find */
  async [ActionsList.FIND]({ commit }, { slug, isAdmin } = {}) {
    try {
      const { data } = await this.$axios.get(
        Api[isAdmin ? 'new' : 'new'].EDIT_CATEGORY(slug)
      )
      commit(MutationsList.SET_CATEGORY, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Put */
  async [ActionsList.PUT]({ state, commit }) {
    try {
      await this.$axios.put(
        Api.new.EDIT_CATEGORY(state.category.id),
        format(state.category, [
          //
          'groups',
          // @ts-ignore
          (x) => x.map((i) => i.id)
        ])
      )
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_CATEGORY)
      commit(MutationsList.CLEAR_FORM_ERROR)
    } catch (e) {
      Vue.notification.error('smth')
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
      throw e
    }
  }
}

// @ts-ignore
function format(data, [name, fn]) {
  return Object.assign(cd(data), {
    [name]: fn(data[name])
  })
}
