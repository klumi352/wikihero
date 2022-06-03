/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable valid-typeof */
import { MutationTree, ActionTree } from 'vuex'
import Vue from 'vue'
import { Context } from 'node-sass'
import isArray from 'lodash/isArray'
import { RootState } from '~/store'
import { Api } from '@/api.config'

type FindType = {
  id: number
}

type PublishType = {
  id: number
  publish: number
}

type DeleteType = {
  id: number
}

type ApproveType = {
  id: number
}

type SetInputType = {
  name: string
  value: string
}

type CommentDataType = {
  author_avatar: object
  author_company: string
  author_job_title: string
  author_name: string
  body: string
  id: number
  is_anonymous: number
  is_blocked: number
  is_new: number
  post: object
  user_voted: boolean
  votes: number
}

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  SET_INITIAL_COMMENT = 'SET_INITIAL_COMMENT',
  SET_FETCH_DATA = 'SET_FETCH_DATA'
}

export enum ActionsList {
  FIND_COMMENT = 'FIND_COMMENT',
  EDIT_COMMENT = 'EDIT_COMMENT',
  CHANGE_PUBLISH = 'CHANGE_PUBLISH',
  DELETE_COMMENT = 'DELETE_COMMENT',
  APPROVE_COMMENT = 'APPROVE_COMMENT'
}

/**
 * State
 */

export const getInitialCommentData = () => ({
  body: ''
})

export const state = () => ({
  fetch_comment_data: {},
  comment: getInitialCommentData()
})

export const strict = false
export type State = ReturnType<typeof state>

/**
 * Declare Mutations & Actions type
 */

export type Mutations<S = State> = {
  [MutationsList.HANDLE_FORM_INPUT](
    state: S,
    { name, value }: SetInputType
  ): void
  [MutationsList.SET_INITIAL_COMMENT](state: S): void
  [MutationsList.SET_FETCH_DATA](state: S, value: CommentDataType): void
}

export interface Actions {
  [ActionsList.FIND_COMMENT](
    { state, commit }: any,
    { id }: FindType
  ): Promise<void>
  [ActionsList.EDIT_COMMENT](
    { state, commit }: any,
    { id }: FindType
  ): Promise<void>
  [ActionsList.CHANGE_PUBLISH](
    { state, commit }: any,
    { id }: PublishType
  ): Promise<void>
  [ActionsList.DELETE_COMMENT](
    { state, commit }: any,
    { id }: DeleteType
  ): Promise<void>
  [ActionsList.APPROVE_COMMENT](
    { state, commit }: any,
    { id }: ApproveType
  ): Promise<void>
}

/**
 * Mutations
 */

export const mutations: MutationTree<State> & Mutations = {
  /**
   * Set Mutations
   */
  [MutationsList.HANDLE_FORM_INPUT](state, { name, value }) {
    Vue.set(state.comment, name, value)
  },
  [MutationsList.SET_INITIAL_COMMENT](state) {
    state.comment = getInitialCommentData()
  },
  [MutationsList.SET_FETCH_DATA](state, value) {
    state.fetch_comment_data = value
  }
}

/**
 * Actions
 */

export const actions: ActionTree<State, State> & Actions = {
  async [ActionsList.FIND_COMMENT]({ state, commit }, { id }) {
    const vm = this as any
    try {
      commit(MutationsList.SET_FETCH_DATA, {})
      commit(MutationsList.SET_INITIAL_COMMENT)
      const { data } = await vm.$axios.get(Api.new.GET_COMMENT_BY_ID(id))
      commit(MutationsList.SET_FETCH_DATA, data)
      commit(MutationsList.HANDLE_FORM_INPUT, {
        name: 'body',
        value: data.body
      })
    } catch (e) {
      throw e
    }
  },
  async [ActionsList.EDIT_COMMENT]({ state, commit }, { id }) {
    const vm = this as any
    try {
      const params = { body: state.comment.body }
      await vm.$axios.put(Api.new.SET_EDITED_COMMENT_BY_ID(id), params)
      Vue.notification.success('update')
      commit(MutationsList.SET_FETCH_DATA, {})
      commit(MutationsList.SET_INITIAL_COMMENT)
    } catch (e) {
      Vue.notification.error('smth')
      throw e
    }
  },
  async [ActionsList.CHANGE_PUBLISH]({ commit }, { id, publish }) {
    const vm = this as any
    try {
      // @ts-ignore
      const params = {
        is_blocked: Number(publish)
      }
      await vm.$axios.put(Api.new.SET_EDITED_COMMENT_BY_ID(id), params)
      Vue.notification.success('publish')
    } catch (e) {
      Vue.notification.error('publish')
      throw e
    }
  },
  async [ActionsList.DELETE_COMMENT]({ state, commit }, { id }) {
    const vm = this as any

    try {
      if (!confirm(vm.app.i18n.t('modal.are-you-sure'))) return
      // @ts-ignore
      await this.$axios.delete(Api.new.DELETE_COMMENT_BY_ID(id))
      Vue.notification.success('delete')
    } catch (e) {
      Vue.notification.error('delete')
      throw e
    }
  },
  [ActionsList.APPROVE_COMMENT]({ commit }, { id }) {
    const vm = this as any

    return new Promise((resolve, reject) => {
      Vue.$showPrompt({
        title: vm.app.i18n.t('modal.are-you-sure'),
        confirmModal: true,
        action: async () => {
          try {
            // @ts-ignore
            await vm.$axios.post(Api.new.APPROVE_COMMENT(id))
            Vue.notification.success('approve')
          } catch (e) {
            Vue.notification.error('approve')
            throw e
          } finally {
            resolve()
          }
        }
      })
    })
  }
}
