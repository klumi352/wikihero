/* eslint-disable camelcase */
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Api } from '@/api.config'
import { findDeep } from '@/helpers'

/** helpers */
import { RootState } from '~/store'

export const mt = {
  SET_DATA: 'SET_DATA',
  SET_CHILDREN: 'SET_CHILDREN',
  SET_VISIBILITY: 'SET_VISIBILITY',
  SET_HOVER: 'SET_HOVER',
  SET_MODAL_NAME: 'SET_MODAL_NAME'
}

export const state = () => ({
  modal: {
    modalNames: [] as string[]
  },
  asideMenu: {
    isHover: false as boolean,
    isShow: false as boolean,
    data: {} as any
  }
})

export const strict = false
export type Ui = ReturnType<typeof state>
export const getters: GetterTree<Ui, RootState> = {
  modalNames: (state) => state.modal.modalNames,
  isHover: (state) => state.asideMenu.isHover,
  isShow: (state) => state.asideMenu.isShow,
  asideData: (state) => state.asideMenu.data
}

export const mutations: MutationTree<Ui> = {
  /**
   * LOADING */
  [mt.SET_DATA]: (state, { data }) => {
    state.asideMenu.data = data
  },
  [mt.SET_CHILDREN]: (state, { data, combineSlug }) => {
    const placeToPaste = findDeep(
      state.asideMenu.data,
      (i: any) => i?.slug === combineSlug
    )

    if (!placeToPaste.children) {
      Vue.set(placeToPaste, 'children', data)
    } else {
      Vue.set(placeToPaste, 'children', null)
    }
  },
  [mt.SET_VISIBILITY]: (state, payload) => {
    state.asideMenu.isShow = Boolean(payload)
    state.asideMenu.isHover = false
  },
  [mt.SET_HOVER]: (state, payload) => {
    if (!state.asideMenu.isShow) {
      state.asideMenu.isHover = Boolean(payload)
    }
  },
  [mt.SET_MODAL_NAME]: (state, name) => {
    if (state.modal.modalNames.includes(name)) {
      state.modal.modalNames = state.modal.modalNames.filter((n) => n !== name)
    } else {
      state.modal.modalNames.push(name)
    }
  }
}

export const actions: ActionTree<Ui, RootState> = {
  async boot({ commit }, { combineSlug, initialLoad } = {}) {
    try {
      const { currentRoute } = this.$router
      let respData: any

      if (currentRoute.name === 'topic-subtopic' && initialLoad) {
        respData = {
          data: (await this.$axios.get(
            Api.client.MENU_GET(
              `${currentRoute.params.topic}/${currentRoute.params.subtopic}`
            )
          )) as any
        }
      } else {
        respData = (await this.$axios.get('/groups-menu')) as any
      }

      if (combineSlug) {
        commit(mt.SET_CHILDREN, { combineSlug, data: respData.children })
      } else {
        commit(mt.SET_DATA, { data: respData.data })
      }
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  }
}
