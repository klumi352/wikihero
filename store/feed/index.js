/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
import Vue from 'vue'

import get from 'lodash/get'
import { Api } from '@/api.config'

export const mt = {
  SET_POSTS: 'SET_POSTS',
  UPDATE_POST: 'UPDATE_POST'
}

export const act = {
  FETCH_POST: 'FETCH_POST'
}

export const state = () => ({
  posts: {
    this_week: {},
    last_week: {},
    rest_month: {}
  }
})

export const getters = {
  getThisWeek: (state) => state.posts.this_week.data || [],
  getLastWeek: (state) => state.posts.last_week.data || [],
  getRestMonth: (state) => state.posts.rest_month.data || []
}

export const mutations = {
  [mt.SET_POSTS](state, { key, value }) {
    Vue.set(state.posts[key], 'data', value.data)
    Vue.set(state.posts[key], 'meta', value.meta)
  },
  [mt.UPDATE_POST](state, { key, value }) {
    state.posts[key].data.push(...value.data)
    Vue.set(state.posts[key], 'meta', value.meta)
  }
}

export const actions = {
  async [act.FETCH_POST](
    { commit, state },
    { sort_by, categ_id, has_id } = {
      sort_by: 'recent',
      categ_id: [],
      has_id: []
    }
  ) {
    const params = {
      per_page: process.env.NEW_FEED_PER_PAGE,
      page: 1,
      order_by: sort_by,
      categories_id: categ_id,
      hashtags_id: has_id
    }
    try {
      let [
        { data: thisWeek, meta: thisWeekMeta },
        { data: lastWeek, meta: lastWeekMeta },
        { data: restMonth, meta: restMonthMeta }
      ] = await Promise.all([
        this.$axios.get(Api.new.FEED_FOR_THIS_WEEK, { params }),
        this.$axios.get(Api.new.FEED_FOR_LAST_WEEK, { params }),
        this.$axios.get(Api.new.FEED_FOR_REST_OF_MONTH, { params })
      ])
      lastWeek = lastWeek.map((item) => ({
        ...item,
        currentStep: 0,
        showPreview: true,
        is_worked: false
      }))
      thisWeek = thisWeek.map((item) => ({
        ...item,
        currentStep: 0,
        showPreview: true,
        is_worked: false
      }))
      restMonth = restMonth.map((item) => ({
        ...item,
        currentStep: 0,
        showPreview: true,
        is_worked: false
      }))
      commit(mt.SET_POSTS, {
        key: 'this_week',
        value: { data: thisWeek, meta: thisWeekMeta }
      })
      commit(mt.SET_POSTS, {
        key: 'last_week',
        value: { data: lastWeek, meta: lastWeekMeta }
      })
      commit(mt.SET_POSTS, {
        key: 'rest_month',
        value: { data: restMonth, meta: restMonthMeta }
      })
    } catch (e) {
      throw e
    } finally {
    }
  }
}
