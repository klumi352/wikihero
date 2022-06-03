/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
import { MutationTree, ActionTree } from 'vuex'

import { Api } from '@/api.config'

export const strict = false

export enum MutationsList {
  SET_CONTRIBUTORS_DATA = 'SET_CONTRIBUTORS_DATA',
  PUSH_CONTRIBUTORS_DATA = 'PUSH_TIPS_DATA',
  PUSH_TEST_DATA = 'PUSH_TEST_DATA',
  SET_CONTRIBUTORS_HOME = 'SET_CONTRIBUTORS_HOME'
}

export enum ActionsList {
  GET_CONTRIBUTORS_DATA = 'GET_CONTRIBUTORS_DATA',
  PUSH_CONTRIBUTORS_DATA = 'PUSH_TIPS_DATA',
  GET_TEST_DATA = 'GET_TEST_DATA',
  GET_CONTRIBUTORS_HOME = 'GET_CONTRIBUTORS_HOME'
}

export const getInitialTipsData = () => ({
  data: [],
  links: {},
  meta: {}
})

export const state = () => ({
  listData: getInitialTipsData() as any,
  home_hero: getInitialTipsData() as any,
  test: [] as any[],
  page: 1 as any
})

export type State = ReturnType<typeof state>

export type Mutations<S = State> = {
  [MutationsList.SET_CONTRIBUTORS_DATA](state: S, value: any): void
  [MutationsList.PUSH_TEST_DATA](state: S, value: any): void
  [MutationsList.SET_CONTRIBUTORS_HOME](state: S, value: any): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationsList.SET_CONTRIBUTORS_HOME](state, value: any) {
    state.home_hero = value
  },
  [MutationsList.SET_CONTRIBUTORS_DATA](state, value: any) {
    state.listData = value
  },
  [MutationsList.PUSH_CONTRIBUTORS_DATA](state, value) {
    state.listData.meta = value.meta
    state.listData.links = value.links
    state.listData.data.push(...value.data)
  },
  [MutationsList.PUSH_TEST_DATA](state, value: any) {
    state.page = state.page + 1
    state.test.push(...value.data)
  }
}

export const actions: ActionTree<State, State> = {
  async [ActionsList.GET_CONTRIBUTORS_DATA]({ commit }, { page = 1 } = {}) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await this.$axios.get('/user/contributors', {
        params: {
          page
        }
      })

      if (page > 1) commit(MutationsList.PUSH_CONTRIBUTORS_DATA, result)
      else commit(MutationsList.SET_CONTRIBUTORS_DATA, result)
    } catch (e) {
      throw e
    }
  },
  async [ActionsList.GET_TEST_DATA]({ commit, state }) {
    try {
      const data: any = await this.$axios.get('/user/contributors', {
        params: {
          page: state.page
        }
      })
      commit(MutationsList.PUSH_TEST_DATA, data)
    } catch (e) {
      throw e
    }
  },
  async [ActionsList.GET_CONTRIBUTORS_HOME]({ commit, state }) {
    try {
      const data: any = await this.$axios.get(Api.client.RANDOM_CONTRIBUTORS)
      commit(MutationsList.SET_CONTRIBUTORS_HOME, data)
    } catch (e) {
      throw e
    }
  }
}
