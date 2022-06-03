/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '~/store'
import { Api } from '@/api.config'

export enum MutationsList {
  SET_GROUP_DATA = 'SET_GROUP_DATA',
  SET_CATEGORY_DATA = 'SET_CATEGORY_DATA',
  TOOGLE_LOADING_VARIABLE = 'TOOGLE_LOADING_VARIABLE'
}

export enum ActionsList {
  FETCH_GROUPS = 'FETCH_GROUPS',
  FETCH_DATA = 'FETCH_DATA',
  FETCH_CATEGORIES = 'FETCH_CATEGORIES'
}

export const state = () => ({
  no_sub_group: [],
  sub_group: [],
  categories: [],
  loading: false
})

export const strict = false
export type State = ReturnType<typeof state>

export type Mutations<S = State> = {
  [MutationsList.SET_GROUP_DATA](state: S, { nosub_data, sub_data }: any): void
  [MutationsList.SET_CATEGORY_DATA](state: S, payload: any): void
  [MutationsList.TOOGLE_LOADING_VARIABLE](state: S, payload: any): void
}

export const getters: GetterTree<State, RootState> = {
  getNoSub: (state) => state.no_sub_group,
  getSub: (state) => state.sub_group,
  getCateg: (state) => state.categories,
  getLoad: (state) => state.loading
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationsList.SET_GROUP_DATA](state, { nosub_data, sub_data }) {
    state.no_sub_group = nosub_data
    state.sub_group = sub_data
  },
  [MutationsList.SET_CATEGORY_DATA](state, payload) {
    state.categories = payload
  },
  [MutationsList.TOOGLE_LOADING_VARIABLE](state, payload) {
    state.loading = payload
  }
}

export const actions: ActionTree<State, RootState> = {
  async [ActionsList.FETCH_GROUPS](
    { commit },
    { search } = { search: null }
  ): Promise<void> {
    try {
      const s = { params: { search } }
      /* Api-> GET_BOTH_GROUPS -> /all-groups */
      const { data } = await this.$axios.get(Api.new.GET_BOTH_GROUPS, s)
      commit(MutationsList.SET_GROUP_DATA, {
        nosub_data: data.not_subscribed_groups,
        sub_data: data.subscribed_groups
      })
    } catch (error) {
      console.error(error)
    }
  },
  async [ActionsList.FETCH_DATA]({ dispatch, commit }, { isGroupPage }) {
    commit(MutationsList.TOOGLE_LOADING_VARIABLE, false)
    if (isGroupPage) dispatch(ActionsList.FETCH_CATEGORIES)
    await dispatch(ActionsList.FETCH_GROUPS)
    commit(MutationsList.TOOGLE_LOADING_VARIABLE, true)
  },
  async [ActionsList.FETCH_CATEGORIES]({ commit }) {
    try {
      /* Api -> GET_ALL_CATEGORIES_CLIENT -> /group-category */
      const { data } = await this.$axios.get(Api.new.GET_ALL_CATEGORIES_CLIENT)
      const categData = data.map((c: Object) => ({
        ...c,
        isChecked: false
      }))
      commit(MutationsList.SET_CATEGORY_DATA, categData)
    } catch (error) {
      console.error(error)
    }
  }
}
