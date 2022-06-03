/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'

/** helpers */
import isArray from 'lodash/isArray'
import { Api } from '@/api.config'
import { RootState } from '~/store'

export const mt = {
  SET_TOPIC: 'SET_TOPIC',
  // @@@ filtered
  SET_SUBTOPICS_DATA: 'SET_SUBTOPICS_DATA',
  PUSH_SUBTOPICS_DATA: 'PUSH_SUBTOPICS_DATA',
  // @@@ nested
  SET_NESTED_DATA: 'SET_NESTED_DATA',
  PUSH_NESTED_DATA: 'PUSH_NESTED_DATA',
  // @@@ handle
  SET_INITIAL_TOPIC: 'SET_INITIAL_TOPIC',
  HANDLE_TOPIC_INPUT: 'HANDLE_TOPIC_INPUT',
  HANDLE_FORM_INPUT: 'HANDLE_FORM_INPUT',
  // @@@ errors
  SET_FORM_ERROR: 'SET_FORM_ERROR',
  CLEAR_FORM_ERROR: 'CLEAR_FORM_ERROR'
}

export const act = {}

export enum filterTypes {
  TOP = 'top',
  TREND = 'trend',
  NEW = 'new',
  ALPHA = 'alpha'
}

export const defaultFilter = filterTypes.ALPHA
export const defaultChecked = Object.values(filterTypes).indexOf(defaultFilter)
export const redirectChecked = Object.values(filterTypes).indexOf(
  filterTypes.ALPHA
)

export const getInitialTopic = () => ({
  name: '',
  description: '',
  slug: '',
  tip_grouping: false,
  parent_id: null
})

export const state = () => ({
  topic: getInitialTopic() as any,
  form: getInitialTopic() as any,
  subtopics: null as any,
  nested: null as any,
  errors: {} as any
})

export const strict = false
export type Topic = ReturnType<typeof state>
export const getters: GetterTree<Topic, RootState> = {
  isNoGroup: (state) => {
    return !!state.topic?.tip_grouping
  },
  topicName: (state) => state.topic?.name || '',
  nestedList: (state) => state.nested?.data,
  nestedMeta: (state) => state.nested?.meta,
  subtopicsList: (state) => state.subtopics?.data,
  subtopicsMeta: (state) => state.subtopics?.meta
}

export const mutations: MutationTree<Topic> = {
  /**
   * SET_TOPIC */
  [mt.SET_TOPIC](state, value) {
    state.topic = value
  },
  [mt.SET_INITIAL_TOPIC](state) {
    state.topic = getInitialTopic()
    state.form = getInitialTopic()
  },
  /**
   * SET_SUBTOPICS_DATA */
  [mt.SET_SUBTOPICS_DATA](state, value) {
    state.subtopics = value
  },
  [mt.PUSH_SUBTOPICS_DATA](state, value) {
    state.subtopics.meta = value.meta
    state.subtopics.links = value.links
    state.subtopics.data.push(...value.data)
  },
  /**
   * SET_NESTED_DATA */
  [mt.SET_NESTED_DATA](state, value) {
    state.nested = value
  },
  [mt.PUSH_NESTED_DATA](state, value) {
    state.nested.meta = value.meta
    state.nested.links = value.links
    state.nested.data.push(...value.data)
  },
  /**
   * FORMS */
  [mt.HANDLE_FORM_INPUT]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  /**
   * ERRORS */
  [mt.HANDLE_TOPIC_INPUT]: (state, { name, value }) => {
    Vue.set(state.topic, name, value)
  },
  [mt.SET_FORM_ERROR]: (state, payload) => {
    Object.keys(payload).forEach((key) => {
      Vue.set(
        state.errors,
        key,
        isArray(payload[key]) ? payload[key].join(' ') : payload[key]
      )
    })
  },
  [mt.CLEAR_FORM_ERROR]: (state) => {
    Object.keys(state.errors).forEach((key) => {
      Vue.set(state.errors, key, '')
    })
  }
}

export const actions: ActionTree<Topic, RootState> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeConfirm({ commit }, { id, confirm }) {
    const vm = this as any

    return new Promise((resolve, reject) => {
      if (!confirm) {
        Vue.$showPrompt({
          title: vm.app.i18n.t('modal.leave-comment'),
          action: async (comment: string) => {
            try {
              await this.$axios.put(Api.admin.TOPIC_CONFIRM(id), {
                is_confirmed: 0,
                comment
              })
              Vue.notification.success('disconfirm')
            } catch (e) {
              Vue.notification.error('smth')
              throw e
            } finally {
              resolve()
            }
          }
        })
      } else {
        Vue.$showPrompt({
          title: vm.app.i18n.t('modal.are-you-sure'),
          confirmModal: true,
          action: async () => {
            try {
              await this.$axios.put(Api.admin.TOPIC_CONFIRM(id), {
                is_confirmed: 1
              })
              Vue.notification.success('confirm')
            } catch (e) {
              Vue.notification.error('smth')
              throw e
            } finally {
              resolve()
            }
          }
        })
      }
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changePublish({ commit }, { id }) {
    try {
      await this.$axios.put(Api.admin.TOPIC_PUBLISH(id))
      Vue.notification.success('publish')
    } catch (e) {
      Vue.notification.error('publish')
      throw e
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async changeFollow({ commit }, { topic }: any = {}) {
    try {
      if (!topic.is_follow) {
        await this.$axios.post(Api.client.TOPIC_SUBSCRIBE, {
          topic_id: topic.id
        })
        Vue.notification.success('subscribe')
      } else {
        await this.$axios.put(Api.client.TOPIC_UNSUBSCRIBE(topic.id))
        Vue.notification.success('unsubscribe')
      }
      return !topic.is_follow
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e.message)
      throw e
    }
  },
  /**
   * Put */
  async put({ state, commit }, { trigger, redirect } = {}) {
    try {
      await this.$axios.put(Api.admin.TOPIC_EDIT(state.topic.id), state.topic)
      Vue.notification.success('update')
      commit(mt.SET_INITIAL_TOPIC)
      trigger && this.$router.push(`${redirect || `/${state.topic.slug}`}`)
    } catch (e) {
      Vue.notification.error('smth')
      commit(mt.SET_FORM_ERROR, e.response.data.errors)
      throw e
    }
  },

  /**
   * Reorder */
  async reorder({ state, commit }, { trigger, redirect, data } = {}) {
    const id = data?.id || state.topic.id
    const parent_id = data?.parentId || state.topic.parent_id
    try {
      await this.$axios.put(Api.admin.TOPIC_REORDER(id), { parent_id })
      Vue.notification.success('update')
      commit(mt.SET_INITIAL_TOPIC)
      trigger && this.$router.push(`${redirect || `/${state.topic.slug}`}`)
    } catch (e) {
      Vue.notification.error('smth')
      commit(mt.SET_FORM_ERROR, e.response.data.errors)
      throw e
    }
  },
  /**
   * Store */
  async store({ state, commit, rootGetters }, { trigger, redirect } = {}) {
    try {
      await this.$axios.post(
        Api[rootGetters['auth/isAdmin'] ? 'admin' : 'client'].TOPIC_CREATE,
        state.form
      )
      Vue.notification.success('update')
      trigger && this.$router.push(`${redirect || `/${state.form.slug}`}`)
      commit(mt.SET_INITIAL_TOPIC)
      commit(mt.CLEAR_FORM_ERROR)
    } catch (e) {
      Vue.notification.error('smth')
      commit(mt.SET_FORM_ERROR, e.response.data.errors)
      throw e
    }
  },
  /**
   * Delete */
  async delete({ state, commit }, { trigger, id } = {}) {
    const vm = this as any

    try {
      if (!confirm(vm.app.i18n.t('modal.are-you-sure'))) return
      //
      await this.$axios.delete(Api.admin.TOPIC_DELETE(id || state.topic.id))
      if (trigger) this.$router.push(`/`)
      Vue.notification.success('delete')
      commit(mt.SET_INITIAL_TOPIC)
    } catch (e) {
      Vue.notification.error('delete')
      throw e
    }
  },
  /**
   * GET ONLY
   *
   * Find */
  async findSingleTopic({ commit }, { slug, isAdmin }) {
    try {
      const { data } = await this.$axios.get(
        Api[isAdmin ? 'admin' : 'client'].TOPIC(slug)
      )
      commit(mt.SET_TOPIC, data)
    } catch (e) {
      throw e
    }
  },
  /**
   *
   *
   * NESTED SUBTOPICS */
  async getNestedSubtopics(
    { commit },
    {
      slug,
      perPage = Number(process.env.SUBTOPICS_IN_SUBTOPIC_PER_PAGE),
      page = 1
    }: Partial<NestedProp> = {}
  ) {
    try {
      const data = await this.$axios.get(Api.client.SUBTOPIC_NESTED_ALL(slug), {
        params: {
          perPage,
          page
        }
      })
      if (page > 1) commit(mt.PUSH_NESTED_DATA, data)
      else commit(mt.SET_NESTED_DATA, data)
    } catch (e) {
      throw e
    }
  },
  /**
   *
   *
   * BY OVERAL SUBTOPICS */
  async getSubtopicInOveral(
    { commit },
    {
      slug,
      sort = defaultFilter,
      perPage = Number(process.env.SUBTOPICS_MAIN_PER_PAGE),
      page = 1
    }: Partial<NestedProp> = {}
  ) {
    try {
      const data = await this.$axios.get(
        Api.client.SUBTOPIC_FILTERED_ALL(slug),
        {
          params: {
            perPage,
            sort_by: sort,
            page
          }
        }
      )
      if (page > 1) commit(mt.PUSH_SUBTOPICS_DATA, data)
      else commit(mt.SET_SUBTOPICS_DATA, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Find for client */
  async find({ commit }, { slug }) {
    try {
      const { data } = await this.$axios.get(Api.client.TOPIC(slug))
      commit(mt.SET_TOPIC, data)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message)
      throw e
    }
  }
}

interface NestedProp {
  slug?: string | number
  sort?: filterTypes
  worked: boolean
  perPage: number
  page: number
  isAdmin: boolean
}
