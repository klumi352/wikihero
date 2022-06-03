/* eslint-disable valid-typeof */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import isArray from 'lodash/isArray'
import { RootState } from '~/store'
import { Api } from '@/api.config'

interface PutParams {
  trigger: boolean
  redirect: string
}

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  SET_INITIAL_GROUP = 'SET_INITIAL_GROUP',
  SET_GROUP = 'SET_GROUP',
  HANDLE_GROUP_INPUT = 'HANDLE_GROUP_INPUT',
  SET_FORM_ERROR = 'SET_FORM_ERROR',
  CLEAR_FORM_ERROR = 'CLEAR_FORM_ERROR',
  SET_GROUP_PAGE = 'SET_GROUP_PAGE',
  SET_INITIAL_FORM = 'SET_INITIAL_FORM',
  TOOGLE_POINT_POPUP = 'TOOGLE_POINT_POPUP'
}

export enum ActionsList {
  STORE = 'STORE',
  DELETE = 'DELETE',
  FIND = 'FIND',
  PUT = 'PUT',
  SET_GROUP_PAGE = 'SET_GROUP_PAGE',
  CHANGE_FOLLOW = 'CHANGE_FOLLOW'
}

export const getInitialGroup = () => ({
  title: '',
  description: '',
  slug: '',
  is_active: 1,
  topic_id: null,
  logo: null,
  moderator_image: null
})

export const state = () => ({
  errors: {} as any,
  form: getInitialGroup() as any,
  group: getInitialGroup() as any,
  group_page: {} as any,
  logged_point_popup_id: null
})

export const strict = false
export type Group = ReturnType<typeof state>

export const getters: GetterTree<Group, RootState> = {
  groupName: (state) => state.group_page?.title || '',
  groupLogoUrl: (state) => state.group.logo?.original_url,
  groupModeratorUrl: (state) => state.group.moderator_image?.original_url
}

export const mutations: MutationTree<Group> = {
  /**
   * FORMS */
  [MutationsList.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [MutationsList.TOOGLE_POINT_POPUP](state, value) {
    state.logged_point_popup_id = value
  },
  [MutationsList.SET_INITIAL_GROUP](state) {
    state.form = getInitialGroup()
  },
  [MutationsList.SET_GROUP](state, value) {
    state.group = value
  },
  [MutationsList.HANDLE_GROUP_INPUT]: (state, { name, value }) => {
    Vue.set(state.group, name, value)
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
  },
  [MutationsList.SET_GROUP_PAGE]: (state, value) => {
    state.group_page = value
  },
  [MutationsList.SET_INITIAL_FORM](state) {
    state.form = getInitialGroup()
  }
}

export const actions: ActionTree<Group, RootState> = {
  /**
   * Store */
  async [ActionsList.STORE](
    { state, commit, rootGetters },
    { trigger, redirect } = {}
  ) {
    const formData: any = new FormData()
    Object.keys(state.form || {}).forEach((key) => {
      formData.append(key, state.form[key])
    })
    try {
      await this.$axios.post(
        Api[rootGetters['auth/isAdmin'] ? 'new' : 'new'].SET_NEW_GROUP,
        formData
      )
      Vue.notification.success('update')
      trigger && this.$router.push(`${redirect || `/${state.group.slug}`}`)
      commit(MutationsList.SET_INITIAL_GROUP)
      commit(MutationsList.CLEAR_FORM_ERROR)
    } catch (e) {
      Vue.notification.error('smth')
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
      throw e
    }
  },
  /**
   * Delete */
  async [ActionsList.DELETE]({ state, commit }, { trigger, id } = {}) {
    const vm = this as any

    try {
      if (!confirm(vm.app.i18n.t('modal.are-you-sure'))) return
      //
      await this.$axios.delete(Api.new.DELETE_GROUP(id || state.group.id))
      if (trigger) this.$router.push(`/`)
      Vue.notification.success('delete')
      commit(MutationsList.SET_INITIAL_GROUP)
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
        Api[isAdmin ? 'new' : 'new'].EDIT_GROUP(slug)
      )
      commit(MutationsList.SET_GROUP, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Put */
  async [ActionsList.PUT]({ state, commit }, { trigger, redirect }: PutParams) {
    const formData: any = new FormData()
    Object.keys(state.group || {}).forEach((key) => {
      formData.append(key, state.group[key])
    })
    if (state.group.logo?.original_url) formData.delete('logo')
    if (state.group.moderator_image?.original_url)
      formData.delete('moderator_image')
    if (!('topic_id' in state.group)) {
      formData.append('topic_id', state.group.topic.id)
    }
    formData.delete('topic')
    try {
      await this.$axios.post(Api.new.UPDATE_GROUP(state.group.id), formData)
      Vue.notification.success('update')
      if (trigger)
        this.$router.push(`${redirect || `${state.group_page.computed_slug}`}`)
      commit(MutationsList.SET_INITIAL_GROUP)
      commit(MutationsList.CLEAR_FORM_ERROR)
    } catch (e) {
      Vue.notification.error('smth')
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
      throw e
    }
  },
  /**
   * Follow
   */
  async [ActionsList.CHANGE_FOLLOW]({ state, commit }, { group = {} }) {
    try {
      if (!group.user_subscribed) {
        await this.$axios.post(Api.new.TOGGLE_SUBSCRIBE(group.slug))
        Vue.notification.success('subscribe')
      } else {
        await this.$axios.post(Api.new.TOGGLE_SUBSCRIBE(group.slug))
        Vue.notification.success('unsubscribe')
      }
      return !group.user_subscribed
    } catch (e) {
      throw e
    }
  },
  /**
   * Group page main request logic
   */
  async [ActionsList.SET_GROUP_PAGE]({ commit, dispatch }, { group_slug }) {
    try {
      commit('post/SET_INITIAL_LIST', null, { root: true })
      const { data } = await this.$axios.get(Api.new.GROUP_BY_SLUG(group_slug))
      await dispatch(
        'post/GET_POSTS_LIST',
        {
          id: data.id
        },
        { root: true }
      )
      commit(MutationsList.SET_GROUP_PAGE, data)
      commit('filter/SET_INITIAL_SELECTED', null, { root: true })
      commit('filter/SET_INITIAL_SORT', null, { root: true })
      return data
    } catch (e) {
      throw e
    }
  }
}
