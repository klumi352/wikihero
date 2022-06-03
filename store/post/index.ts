/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable valid-typeof */
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import Vue from 'vue'
import { Context } from 'node-sass'
import isArray from 'lodash/isArray'
import { RootState } from '~/store'
import { Api } from '@/api.config'

function checkQuillValue(v: string) {
  let value = v.trim()
  if (value === '<p><br></p>') {
    value = ''
    return value
  }
  return value
}

function refactoring(v: any) {
  const formatState: object = {}
  Object.assign(formatState, {
    title: v?.title,
    description: v?.description,
    first_name: v?.author?.name !== null ? v?.author?.name.split(' ')[0] : null,
    last_name: v?.author?.name !== null ? v?.author?.name.split(' ')[1] : null,
    job_title: v?.author?.job_title,
    is_anonymous: Boolean(v?.is_anonymous),
    topic_id: v?.topic_id || v?.topic?.id,
    group_id: v?.group !== null ? v?.group?.id : v?.group,
    category_id: v?.category !== null ? v?.category?.id : v?.category,
    is_active: v?.is_active,
    email: v?.author?.email,
    slug: v?.slug,
    /**
     * ---
     */
    id: v?.id,
    meta_title: v?.meta_title,
    meta_description: v?.meta_description,
    meta_keywords: v?.meta_keywords,
    author_id: v?.author?.user_id || v?.author?.id,
    author_data: v?.author,
    user_id: v?.author?.user_id || v?.author?.id || 1,
    group_data: v?.group,
    hashtags: v?.hashtags.map(({ name }: any) => name),
    logo: v?.author?.image?.original_url,
    category_data: v?.category
  })
  return formatState
}

// function editPostRefactoring(v: any) {
//   const formatState: object = {}
//   Object.assign(formatState, {
//     title: v.title,
//     description: v.description,
//     first_name: v?.author?.name !== null ? v?.author?.name.split(' ')[0] : null,
//     last_name: v?.author?.name !== null ? v?.author?.name.split(' ')[1] : null,
//     job_title: v?.author?.job_title,
//     is_anonymous: false,
//     topic_id: v?.topic_id || v?.topic?.id,
//     group_id: v?.group !== null ? v?.group?.id : v?.group,
//     category_id: v?.category !== null ? v?.category?.id : v?.category,
//     is_active: v?.is_active,
//     email: v?.author?.email,
//     user_id: v?.author?.user_id,
//     slug: v?.slug
//   })
//   return formatState
// }

export enum MutationsList {
  HANDLE_FORM_INPUT = 'HANDLE_FORM_INPUT',
  PUSH_HASHTAG_NAME = 'PUSH_HASHTAG_NAME',
  SET_INITIAL_POST = 'SET_INITIAL_POST',
  DELETE_HASHTAG = 'DELETE_HASHTAG',
  SET_FORM_ERROR = 'SET_FORM_ERROR',
  DELETE_LAST_HASHTAG = 'DELETE_LAST_HASHTAG',
  SET_POST = 'SET_POST',
  HANDLE_POST_INPUT = 'HANDLE_POST_INPUT',
  SET_INITIAL_FORM = 'SET_INITIAL_FORM',
  VALIDATE_BOOLEANS = 'VALIDATE_BOOLEANS',
  CLEAR_FORM_ERROR = 'CLEAR_FORM_ERROR',
  SET_POSTS_LIST = 'SET_POSTS_LIST',
  SET_POST_PAGE = 'SET_POST_PAGE',
  PUSH_POSTS_LIST = 'PUSH_POSTS_LIST',
  POST_CREATE = 'POST_CREATE',
  POST_CREATE_INITIAL = 'POST_CREATE_INITIAL',
  SET_CREATED_POST_DATA = 'SET_CREATED_POST_DATA',
  SET_FORM_HELP = 'SET_FORM_HELP',
  CLEAR_FORM_PARAM = 'CLEAR_FORM_PARAM',
  SET_INITIAL_LIST = 'SET_INITIAL_LIST',
  SET_INITIAL_HELP = 'SET_INITIAL_HELP'
}

export enum ActionsList {
  CREATE_POST = 'CREATE_POST',
  FIND_POST = 'FIND_POST',
  DELETE_POST = 'DELETE_POST',
  EDIT_POST = 'EDIT_POST',
  CHANGE_PUBLISH = 'CHANGE_PUBLISH',
  CREATE_TEST_POST = 'CREATE_TEST_POST',
  GET_POSTS_LIST = 'GET_POSTS_LIST',
  FIND_POST_BYSLUG = 'FIND_POST_BYSLUG',
  SET_POST_PAGE = 'SET_POST_PAGE',
  APPROVE_POST = 'APPROVE_POST'
}

export const getInitialPostData = () => ({
  title: '',
  description: '',
  first_name: '',
  last_name: '',
  job_title: '',
  is_anonymous: false,
  topic_id: null,
  group_id: null,
  category_id: null,
  hashtags: [],
  is_active: false,
  email: '',
  logo: null,
  slug: ''
})

/**
 * State
 */

export const state = () => ({
  form: getInitialPostData() as any,
  formHelp: {},
  post: {},
  errors: {} as any,
  list: {
    data: []
  } as any,
  post_page: {} as any,
  post_create: false,
  post_created_data: {}
})

export const strict = false
export type State = ReturnType<typeof state>

/**
 * Declare Mutations & Actions type
 */

export type Params = {
  value?: any | string
  obj?: string | any
  name?: any | string
  id?: number | any
  trigger?: boolean | any
  redirect?: string | any
  sort?: string | any
  slug?: string | any
  order_by?: string | any
  page?: number | any
  categ_id?: Array<number> | any
  hashtag_id?: Array<number> | any
}

export type Mutations<S = State> = {
  [MutationsList.HANDLE_FORM_INPUT](state: S, { name, value }: Params): void
  [MutationsList.PUSH_HASHTAG_NAME](state: S, { value, obj }: Params): void
  [MutationsList.SET_INITIAL_POST](state: S): void
  [MutationsList.SET_INITIAL_FORM](state: S): void
  [MutationsList.DELETE_HASHTAG](state: S, { value, obj }: Params): void
  [MutationsList.DELETE_LAST_HASHTAG](state: S, { value, obj }: Params): void
  [MutationsList.SET_POST](state: S, value: any): void
  [MutationsList.HANDLE_POST_INPUT](state: S, { name, value }: Params): void
  [MutationsList.VALIDATE_BOOLEANS](state: S, { name, value }: Params): void
  [MutationsList.CLEAR_FORM_ERROR](state: S): void
  [MutationsList.SET_FORM_ERROR](state: S, payload: any): void
  [MutationsList.SET_POSTS_LIST](state: S, value: any): void
  [MutationsList.SET_POST_PAGE](state: S, value: any): void
  [MutationsList.PUSH_POSTS_LIST](state: S, value: any): void
  [MutationsList.POST_CREATE](state: S): void
  [MutationsList.POST_CREATE_INITIAL](state: S): void
  [MutationsList.SET_CREATED_POST_DATA](state: S, value: any): void
  [MutationsList.SET_FORM_HELP](state: S, { name, value }: Params): void
  [MutationsList.CLEAR_FORM_PARAM](state: S, { name, value }: Params): void
  [MutationsList.SET_INITIAL_LIST](state: S): void
  [MutationsList.SET_INITIAL_HELP](state: S): void
}

export interface Actions {
  [ActionsList.CREATE_POST]({ state, commit }: any): Promise<void>
  [ActionsList.FIND_POST]({ state, commit }: any): Promise<void>
  [ActionsList.EDIT_POST](
    { state, commit }: any,
    { trigger, redirect }: Params
  ): Promise<void>
  [ActionsList.DELETE_POST](
    { state, commit }: any,
    { trigger, id }: Params
  ): Promise<void>
  [ActionsList.CHANGE_PUBLISH]({ commit }: any, { id }: Params): Promise<void>
  [ActionsList.GET_POSTS_LIST](
    { commit }: any,
    { sort, id }: Params
  ): Promise<void>
  [ActionsList.FIND_POST_BYSLUG](
    { commit }: any,
    { slug }: Params
  ): Promise<void>
  [ActionsList.APPROVE_POST]({ commit }: any, { id }: Params): Promise<void>
}

/**
 * Getters
 */

export const getters: GetterTree<State, RootState> = {
  formFullFill: (state) =>
    state.form.title !== '' &&
    state.form.description !== '' &&
    state.form.group_id !== null &&
    state.form.category_id !== null,
  // @ts-ignore
  hashtagsLength: (state) => ({ obj }: any) => state[obj].hashtags?.length >= 5,
  isTagExist: (state) => ({ value, obj }: any) =>
    // @ts-ignore
    state[obj].hashtags.some((tag: any) => tag === value),
  replaceTagExist: (state) => ({ value, obj }: any) =>
    // @ts-ignore
    state[obj].hashtags
      .map((tag: any) => tag.replace('#', ''))
      .some((tag: any) => tag === value),
  postName: (state) => state.post_page?.meta_title || '',
  getGroupId: (state) => state.form.group_id
}

/**
 * Mutations
 */

export const mutations: MutationTree<State> & Mutations = {
  [MutationsList.HANDLE_FORM_INPUT](state, { name, value }) {
    Vue.set(state.form, name, value)
  },
  [MutationsList.PUSH_HASHTAG_NAME](state, { value, obj }) {
    // @ts-ignore
    state[obj].hashtags.push(value)
  },
  [MutationsList.SET_INITIAL_POST](state) {
    state.post = {}
  },
  [MutationsList.SET_INITIAL_FORM](state) {
    state.form = getInitialPostData() as any
  },
  [MutationsList.DELETE_HASHTAG](state, { value, obj }) {
    // @ts-ignore
    state[obj].hashtags = state[obj].hashtags.filter(
      (item: any) => item !== value
    )
  },
  [MutationsList.DELETE_LAST_HASHTAG](state, { value, obj }) {
    // @ts-ignore
    state[obj].hashtags.splice(value, 1)
  },
  [MutationsList.SET_POST](state, value) {
    state.post = value
  },
  [MutationsList.HANDLE_POST_INPUT](state, { name, value }) {
    Vue.set(state.post, name, value)
  },
  [MutationsList.VALIDATE_BOOLEANS](state, { name, value }) {
    Vue.set(state.post, name, value)
  },
  [MutationsList.CLEAR_FORM_ERROR]: (state) => {
    Object.keys(state.errors).forEach((key) => {
      Vue.set(state.errors, key, '')
    })
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
  [MutationsList.SET_POSTS_LIST]: (state, value) => {
    state.list.data = value.data
    state.list.meta = value.meta
    state.list.links = value.links
  },
  [MutationsList.SET_POST_PAGE]: (state, value) => {
    state.post_page = value
  },
  [MutationsList.PUSH_POSTS_LIST]: (state, value) => {
    state.list.links = value.links
    state.list.meta = value.meta
    state.list.data.push(...value.data)
  },
  [MutationsList.POST_CREATE]: (state) => {
    state.post_create = true
  },
  [MutationsList.POST_CREATE_INITIAL]: (state) => {
    state.post_create = false
  },
  [MutationsList.SET_CREATED_POST_DATA]: (state, value) => {
    state.post_created_data = value
  },
  [MutationsList.SET_FORM_HELP](state, { name, value }) {
    Vue.set(state.formHelp, name, value)
  },
  [MutationsList.CLEAR_FORM_PARAM]: (state, { name, value }) => {
    Vue.set(state.form, name, value)
  },
  [MutationsList.SET_INITIAL_LIST]: (state) => {
    state.list.data = []
    state.list.meta = {}
    state.list.links = {}
  },
  [MutationsList.SET_INITIAL_HELP]: (state) => {
    state.formHelp = {}
  }
}

/**
 * Actions
 */

export const actions: ActionTree<State, State> & Actions = {
  async [ActionsList.CREATE_POST]({ state, commit }) {
    const vm = this as any

    commit(MutationsList.HANDLE_FORM_INPUT, {
      name: 'description',
      value: checkQuillValue(state.form.description)
    })

    try {
      const formdata: any = new FormData()
      Object.keys(state.form || {}).forEach((key) => {
        formdata.append(key, state.form[key])
      })
      ;(function() {
        for (let i = 0; i < state.form.hashtags?.length; i++) {
          formdata.append(`hashtags[${i}]`, state.form.hashtags[i])
        }
        formdata.set('is_anonymous', +state.form.is_anonymous)
        formdata.set('is_active', +state.form.is_active)
        formdata.delete('hashtags')
      })()
      const { data } = await vm.$axios.post('/posts', formdata)
      commit(MutationsList.SET_CREATED_POST_DATA, data)
      commit('auth/SET_USER_LEVEL', data.points, { root: true })
      Vue.notification.success('update')
      commit(MutationsList.SET_INITIAL_FORM)
      commit(MutationsList.CLEAR_FORM_ERROR)
      return data
    } catch (e) {
      Vue.notification.error('smth')
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
      throw e
    }
  },
  async [ActionsList.FIND_POST](
    { state, commit },
    { slug, isAdmin }: any = {}
  ) {
    const vm = this as any
    try {
      const { data } = await vm.$axios.get(
        Api[isAdmin ? 'new' : 'new'].EDIT_POST(slug)
      )
      const readyParams = refactoring(data)
      commit(MutationsList.SET_POST, readyParams)
    } catch (e) {
      throw e
    }
  },
  async [ActionsList.EDIT_POST]({ state, commit }, { trigger, redirect }) {
    commit(MutationsList.VALIDATE_BOOLEANS, {
      name: 'is_anonymous',
      value: +state.post.is_anonymous
    })
    commit(MutationsList.VALIDATE_BOOLEANS, {
      name: 'is_active',
      value: +state.post.is_active
    })
    try {
      // @ts-ignore
      await this.$axios.put(Api.new.UPDATE_POST(state.post.id), state.post)
      Vue.notification.success('update')
      if (trigger)
        // @ts-ignore
        this.$router.push(`${redirect || `${state.post_page.computed_slug}`}`)
      commit(MutationsList.SET_INITIAL_POST)
      commit(MutationsList.CLEAR_FORM_ERROR)
    } catch (e) {
      Vue.notification.error('smth')
      commit(MutationsList.SET_FORM_ERROR, e.response.data)
      throw e
    }
  },
  async [ActionsList.DELETE_POST](
    { state, commit },
    { trigger, id }: any = {}
  ) {
    const vm = this as any

    try {
      if (!confirm(vm.app.i18n.t('modal.are-you-sure'))) return
      // @ts-ignore
      await this.$axios.delete(Api.new.DELETE_POST(id || state.post.id))
      // @ts-ignore
      if (trigger) this.$router.push(`/`)
      Vue.notification.success('delete')
      commit(MutationsList.SET_INITIAL_POST)
    } catch (e) {
      Vue.notification.error('delete')
      throw e
    }
  },
  async [ActionsList.CHANGE_PUBLISH]({ commit }, { id }) {
    try {
      // @ts-ignore
      await this.$axios.get(Api.new.PUBLISH_POST(id))
      Vue.notification.success('publish')
    } catch (e) {
      Vue.notification.error('publish')
      throw e
    }
  },
  async [ActionsList.GET_POSTS_LIST](
    { commit, state },
    { order_by = 'recent', id, page = 1, categ_id = [], hashtag_id = [] }
  ) {
    const vm = this as any
    try {
      const paramsObj = {
        q: '',
        group_id: id,
        categories_id: categ_id,
        hashtags_id: hashtag_id,
        per_page: 50,
        page,
        order_by
      }
      let requestData = await vm.$axios.post(Api.new.GET_ALL_POSTS, paramsObj)
      requestData.data = requestData.data.map((post: any) => ({
        ...post,
        currentStep: 0,
        showPreview: true
      }))
      if (page > 1) {
        commit(MutationsList.PUSH_POSTS_LIST, requestData)
        return
      }
      commit(MutationsList.SET_POSTS_LIST, requestData)
    } catch (e) {
      throw e
    }
  },
  async [ActionsList.FIND_POST_BYSLUG]({ commit }, { slug }) {
    const vm = this as any
    try {
      const { data } = await vm.$axios.get(Api.new.POST_BY_SLUG(slug))
      const readyParams = refactoring(data)
      commit(MutationsList.SET_POST, readyParams)
    } catch (e) {
      throw e
    }
  },
  [ActionsList.APPROVE_POST]({ commit }, { id }) {
    const vm = this as any
    return new Promise((resolve, reject) => {
      Vue.$showPrompt({
        title: vm.app.i18n.t('modal.are-you-sure'),
        confirmModal: true,
        action: async () => {
          try {
            // @ts-ignore
            await this.$axios.post(Api.new.APPROVE_POST(id))
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
  },
  async [ActionsList.SET_POST_PAGE]({ commit }, { post_slug }) {
    try {
      const { data } = await this.$axios.get(Api.new.POST_BY_SLUG(post_slug))
      commit(MutationsList.SET_POST_PAGE, data)
      return data
    } catch (e) {
      throw e
    }
  }
}
