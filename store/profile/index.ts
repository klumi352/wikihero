/* eslint-disable camelcase */
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Api } from '@/api.config'

/** helpers */
import { RootState } from '~/store'

export const mt = {
  SET_DATA: 'SET_DATA',
  SET_AVATAR: 'SET_AVATAR'
}

export const state = () => ({
  data: {} as any,
  profile: {}
})

export const strict = false
export type Profile = ReturnType<typeof state>
export const getters: GetterTree<Profile, RootState> = {}

export const mutations: MutationTree<Profile> = {
  /**
   * LOADING */
  [mt.SET_DATA]: (state, data) => {
    state.data = data
  },
  [mt.SET_AVATAR]: (state, data) => {
    state.data.profile.avatar.original_url = data
  }
}

export const actions: ActionTree<Profile, RootState> = {
  async boot({ commit }) {
    try {
      const { data } = await this.$axios.get(Api.client.PROFILE_SETTING)
      commit(mt.SET_DATA, data)
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  }
}
