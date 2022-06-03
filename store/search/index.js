/* eslint-disable prefer-const */
/* eslint-disable require-await */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { Api } from '@/api.config'

/**
 * Declare Mutations
 */

export const MutationList = {
  /**
   * Dropdown
   */
  SET_GROUP: 'SET_GROUP',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_HASHTAG: 'SET_HASHTAG',
  /**
   * Comment
   */
  SET_COMMENT_DATA: 'SET_COMMENT_DATA',
  SET_COMMENT_SORT: 'SET_COMMENT_SORT',
  /**
   * Post
   */
  SET_POST_DATA: 'SET_POST_DATA',
  SET_POST_SORT: 'SET_POST_SORT',
  /**
   * Group
   */
  SET_GROUP_DATA: 'SET_GROUP_DATA',
  /**
   * Hashtag
   */
  SET_HASHTAG_DATA: 'SET_HASHTAG_DATA',
  /**
   * Filter
   */
  /**
   * Category - filter
   */
  ADD_FILTER_CATEGORY_ID: 'ADD_FILTER_CATEGORY_ID',
  SET_INITIAL_CATEGORY_ID: 'SET_INITIAL_CATEGORY_ID',
  TOOGLE_CATEGORY_LOADING: 'TOOGLE_CATEGORY_LOADING',
  SET_CATEGORY_ID_BY_VALIDATE: 'SET_CATEGORY_ID_BY_VALIDATE',
  /**
   * Hashtag - filter
   */
  ADD_FILTER_HASHTAG_ID: 'ADD_FILTER_HASHTAG_ID',
  SET_INITIAL_HASHTAG_ID: 'SET_INITIAL_HASHTAG_ID',
  TOOGLE_HASHTAG_LOADING: 'TOOGLE_HASHTAG_LOADING',
  SET_HASHTAG_ID_BY_VALIDATE: 'SET_HASHTAG_ID_BY_VALIDATE',
  /**
   * Group - filter
   */
  SET_GROUP_ID: 'SET_GROUP_ID',
  /**
   * Search - filter
   */
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  ADD_DELETE_TYPE_VALUE: 'ADD_DELETE_TYPE_VALUE',
  SET_INITIAL_TYPE_COLLECTION: 'SET_INITIAL_TYPE_COLLECTION',
  SET_TYPE_COLLECTION: 'SET_TYPE_COLLECTION',
  TOOGLE_MOD_TYPE: 'TOOGLE_MOD_TYPE'
}

/**
 * Declare Actions
 */

export const ActionList = {
  /**
   * Dropdown
   */
  FETCH_CATEGORY: 'FETCH_CATEGORY',
  FETCH_HASHTAG: 'FETCH_HASHTAG',
  FETCH_GROUP: 'FETCH_GROUP',
  /**
   * Post
   */
  FETCH_POST: 'FETCH_POST',
  /**
   * Comment
   */
  FETCH_COMMENT: 'FETCH_COMMENT',
  /**
   * Group
   */
  FETCH_GROUP_DATA: 'FETCH_GROUP_DATA'
}

/**
 * State
 */

export const state = () => ({
  /**
   * Dropdown data
   */
  group: [],
  category: [],
  hashtag: [],
  /**
   * Param
   */
  /**
   * Filter
   */
  /**
   * Group id param
   */
  groupId: 0,
  /**
   * Search query param
   */
  searchQuery: null,
  /**
   * Selected category id collection param
   */
  selectedCategoryId: [],
  selectedCategoryId_prepared: [],
  /**
   * Selected hashtag id collection param
   */
  selectedHashtagId: [],
  selectedHashtagId_prepared: [],
  /**
   * Selected type value id collection param
   */
  selectedTypeValue: [],
  modForType: false,
  /**
   * Preloader boolean - UI variable
   */
  categoryLoading: false,
  hashtagLoading: false,
  /**
   * Post data & param
   */
  post: {
    type: 'recent',
    data: [],
    meta: {}
  },
  /**
   * Comment data & param
   */
  comment: {
    type: 'recent',
    data: [],
    meta: {}
  },
  /**
   * Group data & param
   */
  groupData: {
    data: [],
    meta: {}
  },
  /**
   * Hashtag data & param
   */
  hashtagData: {
    data: [],
    meta: {}
  }
})

export const strict = false

/**
 * Getters
 */

export const getters = {
  /**
   * Dropdown data - formated
   */
  groupList: (state) =>
    state.group.map(({ id, title }) => ({ id, title, isChecked: false })),
  categoryList: (state) =>
    state.category.map(({ id, title, posts }) => ({
      id,
      title,
      posts
    })),
  hashtagList: (state) =>
    state.hashtag.map(({ id, name, posts_count }) => ({
      id,
      name,
      posts_count
    })),
  takeCurGroup: (state) => ({ groupId }) =>
    state.group.find(({ id }) => id === groupId),
  hashtagSelected: (state) => ({ id }) =>
    state.selectedHashtagId.some((el) => el?.id === id),
  setGroupId: (state) => {
    switch (state.groupId) {
      case 0:
        return null
      default:
        return state.groupId
    }
  },
  selectedCategIdCollection: (state) =>
    state.selectedCategoryId.map((item) => item?.id),
  selectedHashtagIdCollection: (state) =>
    state.selectedHashtagId.map((item) => item?.id),
  selectedCategIdCollectionByValidation: (state, getters) =>
    getters.selectedCategIdCollection,
  selectedHashtagIdCollectionByValidation: (state, getters) =>
    getters.selectedHashtagIdCollection,
  takeCurHashtag: (state) => ({ hashtagId }) =>
    state.hashtag.find(({ id }) => id === hashtagId),
  takeCurCategory: (state) => ({ categoryId }) =>
    state.category.find(({ id }) => id === categoryId),
  paramExist: (state, getters) =>
    Boolean(
      state.searchQuery ||
        getters.setGroupId ||
        state.selectedCategoryId.length ||
        state.selectedHashtagId.length
    ),
  takeResultCount: (state, getters) => {
    if (getters.paramExist && !state.modForType) {
      return (
        state.post.meta.total +
        state.comment.meta.total +
        state.groupData.meta.total +
        state.hashtagData.meta.total
      )
    } else if (
      (getters.paramExist && state.modForType) ||
      (!getters.paramExist && state.modForType)
    ) {
      let sum = 0
      state.selectedTypeValue.forEach((i) => {
        sum += state[i.id.split('_')[0]]?.meta.total
      })
      return sum
    } else {
      return (
        state.post.meta.total +
        state.comment.meta.total +
        state.groupData.meta.total +
        state.hashtagData.meta.total
      )
    }
  },
  takePostCount: (state, getters) =>
    getters.paramExist ? state.post.meta.total : state.post.meta.total,
  takeCommentCount: (state, getters) =>
    getters.paramExist ? state.comment.meta.total : state.comment.meta.total,
  takeGroupCount: (state) => state.groupData.meta.total,
  takeHashtagCount: (state) => state.hashtagData.meta.total
}

/**
 * Mutations
 */

export const mutations = {
  /**
   * Dropdown
   */
  [MutationList.SET_GROUP](state, value) {
    state.group = value
    state.group.unshift({
      id: 0,
      title: this.app.i18n.t('search.all-website'),
      isChecked: false
    })
  },
  [MutationList.SET_CATEGORY](state, value) {
    state.category = value
  },
  [MutationList.SET_HASHTAG](state, value) {
    state.hashtag = value
  },
  /**
   * Post
   */
  [MutationList.SET_POST_DATA](state, { value, type } = { type: false }) {
    if (type) {
      state.post.data.push(...value.data)
    } else {
      Vue.set(state.post, 'data', value.data)
    }
    Vue.set(state.post, 'meta', value.meta)
  },
  [MutationList.SET_POST_SORT](state, value) {
    Vue.set(state.post, 'type', value)
  },
  /**
   * Comment
   */
  [MutationList.SET_COMMENT_DATA](state, { value, type } = { type: false }) {
    if (type) {
      state.comment.data.push(...value.data)
    } else {
      Vue.set(state.comment, 'data', value.data)
    }
    Vue.set(state.comment, 'meta', value.meta)
  },
  [MutationList.SET_COMMENT_SORT](state, value) {
    Vue.set(state.comment, 'type', value)
  },
  /**
   * Group
   */
  [MutationList.SET_GROUP_DATA](state, { value, type } = { type: false }) {
    if (type) {
      state.groupData.data.push(...value.data)
    } else {
      Vue.set(state.groupData, 'data', value.data)
    }
    Vue.set(state.groupData, 'meta', value.meta)
  },
  /**
   * Hashtag
   */
  [MutationList.SET_HASHTAG_DATA](state, { value, type } = { type: false }) {
    if (type) {
      state.hashtagData.data.push(...value.data)
    } else {
      Vue.set(state.hashtagData, 'data', value.data)
    }
    Vue.set(state.hashtagData, 'meta', value.meta)
  },
  /**
   * Filter
   */
  /**
   * Category - filter
   */
  [MutationList.ADD_FILTER_CATEGORY_ID](state, value) {
    const exist = state.selectedCategoryId.some(({ id }) => id === value.id)
    if (!exist) state.selectedCategoryId.push(value)
    else
      state.selectedCategoryId = state.selectedCategoryId.filter(
        ({ id }) => id !== value.id
      )
  },
  [MutationList.SET_CATEGORY_ID_BY_VALIDATE](state, value) {
    state.selectedCategoryId_prepared = value
  },
  [MutationList.SET_INITIAL_CATEGORY_ID](state) {
    state.selectedCategoryId = []
  },
  [MutationList.TOOGLE_CATEGORY_LOADING](state, value) {
    state.categoryLoading = value
  },
  /**
   * Hashtag - filter
   */
  [MutationList.ADD_FILTER_HASHTAG_ID](state, value) {
    const exist = state.selectedHashtagId.some((item) => item?.id === value?.id)
    if (!exist) state.selectedHashtagId.push(value)
    else
      state.selectedHashtagId = state.selectedHashtagId.filter(
        (item) => item?.id !== value?.id
      )
  },
  [MutationList.SET_HASHTAG_ID_BY_VALIDATE](state, value) {
    state.selectedHashtagId_prepared = value
  },
  [MutationList.SET_INITIAL_HASHTAG_ID](state) {
    state.selectedHashtagId = []
  },
  [MutationList.TOOGLE_HASHTAG_LOADING](state, value) {
    state.hashtagLoading = value
  },
  /**
   * ---
   */
  [MutationList.SET_GROUP_ID](state, value) {
    state.groupId = value
  },
  [MutationList.SET_SEARCH_QUERY](state, value) {
    state.searchQuery = value
  },
  [MutationList.ADD_DELETE_TYPE_VALUE](state, value) {
    const exist = state.selectedTypeValue.some(({ id }) => id === value.id)
    if (!exist) state.selectedTypeValue.push(value)
    else
      state.selectedTypeValue = state.selectedTypeValue.filter(
        ({ id }) => id !== value.id
      )
  },
  [MutationList.SET_INITIAL_TYPE_COLLECTION](state) {
    state.selectedTypeValue = []
  },
  [MutationList.SET_TYPE_COLLECTION](state, value) {
    state.selectedTypeValue = value
  },
  [MutationList.TOOGLE_MOD_TYPE](state, value) {
    state.modForType = value
  }
}

/**
 * Actions
 */

export const actions = {
  /**
   * Fetch dropdown data
   */
  async [ActionList.FETCH_CATEGORY](
    { commit },
    { group_id } = { group_id: null }
  ) {
    const url = group_id
      ? Api.new.CATEGORY_BY_GROUP_ID(group_id)
      : Api.new.CATEGORY_LIST
    try {
      const { data } = await this.$axios.get(url)
      commit(MutationList.SET_CATEGORY, data)
    } catch (e) {
      throw e
    }
  },
  async [ActionList.FETCH_HASHTAG](
    { commit, getters },
    { group_id, pagination, hashtagId, query, categoryId } = {
      group_id: null,
      hashtagId: [],
      query: null,
      categoryId: [],
      last_month: false,
      // eslint-disable-next-line no-use-before-define
      pagination: pagination || false
    }
  ) {
    const params = {
      q: query,
      hashtags_id: getters.selectedHashtagIdCollection || hashtagId,
      group_id,
      categories_id: categoryId,
      pagination: false
    }
    try {
      const { data } = await this.$axios.get(Api.new.HASHTAG_LIST, {
        params
      })
      commit(MutationList.SET_HASHTAG, data)
    } catch (e) {
      throw e
    }
  },
  async [ActionList.FETCH_GROUP]({ commit }) {
    try {
      const { data } = await this.$axios.get(Api.new.GROUP_LIST)
      commit(MutationList.SET_GROUP, data)
    } catch (e) {
      throw e
    }
  },
  /**
   * Post
   */
  async [ActionList.FETCH_POST](
    { commit, state, getters },
    { page, group_id, q, sort_type } = {
      page: 1,
      group_id: null,
      q: null,
      sort_type: 'recent'
    }
  ) {
    try {
      const params = {
        page,
        order_by: sort_type || state.post.type,
        q: q || state.searchQuery,
        group_id: group_id || getters.setGroupId,
        categories_id: getters.selectedCategIdCollectionByValidation,
        hashtags_id: getters.selectedHashtagIdCollectionByValidation,
        per_page: process.env.SEARCH_PER_PAGE
      }
      let { data, meta } = await this.$axios.post(
        Api.new.POST_SEARCH_CONTENT,
        params
      )
      data = data.map((post) => ({
        ...post,
        currentStep: 0,
        showPreview: true,
        is_worked: false,
        type_vote: null
      }))
      commit(MutationList.SET_POST_DATA, {
        value: { data, meta },
        type: page > 1
      })
    } catch (e) {
      throw e
    } finally {
    }
  },
  /**
   * Comment
   */
  async [ActionList.FETCH_COMMENT](
    { commit, state, getters },
    { page, group_id, q, sort_type } = {
      page: 1,
      group_id: null,
      q: null,
      sort_type: 'recent'
    }
  ) {
    try {
      const params = {
        page,
        order_by: sort_type || state.comment.type,
        q: q || state.searchQuery,
        group_id: group_id || getters.setGroupId,
        categories_id: getters.selectedCategIdCollectionByValidation,
        hashtags_id: getters.selectedHashtagIdCollectionByValidation,
        per_page: process.env.SEARCH_PER_PAGE
      }
      let { data, meta } = await this.$axios.get(
        Api.new.COMMENT_SEARCH_CONTENT,
        { params }
      )
      commit(MutationList.SET_COMMENT_DATA, {
        value: { data, meta },
        type: page > 1
      })
    } catch (e) {
      throw e
    } finally {
    }
  },
  /**
   * Group
   */
  async [ActionList.FETCH_GROUP_DATA](
    { commit, state, getters },
    { page, group_id, q, sort_type } = {
      page: 1,
      group_id: null,
      q: null,
      sort_type: 'recent'
    }
  ) {
    try {
      const params = {
        page,
        order_by: sort_type || state.comment.type,
        q: q || state.searchQuery,
        group_id: group_id || getters.setGroupId,
        categories_id: getters.selectedCategIdCollectionByValidation,
        hashtags_id: getters.selectedHashtagIdCollectionByValidation,
        per_page: process.env.SEARCH_PER_PAGE
      }
      let { data, meta } = await this.$axios.get(Api.new.GROUP_SEARCH_CONTENT, {
        params
      })
      commit(MutationList.SET_GROUP_DATA, {
        value: { data, meta },
        type: page > 1
      })
    } catch (e) {
      throw e
    } finally {
    }
  },
  /**
   * Hashtag
   */
  async FETCH_HASHTAG_DATA(
    { commit, state, getters },
    { page, group_id, q, sort_type } = {
      page: 1,
      group_id: null,
      q: null,
      sort_type: 'recent'
    }
  ) {
    try {
      const params = {
        page,
        order_by: sort_type || state.comment.type,
        q: q || state.searchQuery,
        group_id: group_id || getters.setGroupId,
        categories_id: getters.selectedCategIdCollectionByValidation,
        hashtags_id: getters.selectedHashtagIdCollectionByValidation,
        per_page: process.env.SEARCH_PER_PAGE
      }
      let { data, meta } = await this.$axios.get(
        Api.new.HASHTAG_SEARCH_CONTENT,
        {
          params
        }
      )
      commit(MutationList.SET_HASHTAG_DATA, {
        value: { data, meta },
        type: page > 1
      })
    } catch (e) {
      throw e
    } finally {
    }
  }
}
