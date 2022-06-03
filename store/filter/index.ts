/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState } from '~/store'
import { Api } from '@/api.config'

export enum MutationsList {
  PUSH_SELECTED_DATA = 'PUSH_SELECTED_DATA',
  DELETE_SELECTED_DATA = 'DELETE_SELECTED_DATA',
  SET_HASHTAGS_DATA = 'SET_HASHTAGS_DATA',
  PUSH_HASHTAGS_DATA = 'PUSH_HASHTAGS_DATA',
  SET_PER_PAGE = 'SET_PER_PAGE',
  UPDATE_PER_PAGE = 'UPDATE_PER_PAGE',
  SET_CURR_PAGE = 'SET_CURR_PAGE',
  SET_INITIAL_SELECTED = 'SET_INITIAL_SELECTED',
  SET_SORT_TYPE = 'SET_SORT_TYPE',
  SELECT_FILTER = 'SELECT_FILTER',
  CLEAR_SELECT_FILTER = 'CLEAR_SELECT_FILTER',
  SET_COUNT = 'SET_COUNT',
  DELETE_COUNT = 'DELETE_COUNT',
  SET_INITIAL_SORT = 'SET_INITIAL_SORT',
  SET_INITIAL_STATE = 'SET_INITIAL_STATE',
  SET_CATEGORY_DATA = 'SET_CATEGORY_DATA'
}

export enum ActionsList {}

export const state = () => ({
  selected_hashtags: [] as any,
  selected_categories: [] as any,
  categories: {},
  hashtags: {},
  search_params: '',
  current_params: '',
  curr_page: 1,
  per_page: 0,
  sort_type: 'recent',
  isSelectedCategory: 0,
  isSelectedHashtag: 0,
  isSelected: 0,
  showCount: false
})

export const strict = false
export type State = ReturnType<typeof state>

export type Mutations<S = State> = {
  [MutationsList.PUSH_SELECTED_DATA](state: S, { obj, value }: any): void
  [MutationsList.DELETE_SELECTED_DATA](state: S, { value, obj }: any): void
  [MutationsList.SET_HASHTAGS_DATA](state: S, value: any): void
  [MutationsList.PUSH_HASHTAGS_DATA](state: S, value: any): void
  [MutationsList.SET_PER_PAGE](state: S, value: any): void
  [MutationsList.UPDATE_PER_PAGE](state: S, value: any): void
  [MutationsList.SET_CURR_PAGE](state: S, value: any): void
  [MutationsList.SET_INITIAL_SELECTED](state: S): void
  [MutationsList.SET_SORT_TYPE](state: S, value: string): void
  [MutationsList.SET_INITIAL_SORT](state: S): void
  [MutationsList.SELECT_FILTER](state: S): void
  [MutationsList.CLEAR_SELECT_FILTER](state: S): void
  [MutationsList.SET_COUNT](state: S): void
  [MutationsList.DELETE_COUNT](state: S): void
  [MutationsList.SET_INITIAL_STATE](state: S): void
  [MutationsList.SET_CATEGORY_DATA](state: S, value: any): void
}

export const getters: GetterTree<State, RootState> = {
  checkExist: (state) => ({ value, obj }: any) =>
    // @ts-ignore
    state[obj]?.some((i: any) => i.id === value),
  checkMeta: (state) =>
    // @ts-ignore
    state.hashtags?.meta?.current_page === state.hashtags?.meta?.last_page,
  categoriesQuery: (state) =>
    state.selected_categories.reduce(
      (acc: any, item: any) => acc + `&categories[]=${item.id}`,
      ''
    ),
  getHashtagsId: (state) => state.selected_hashtags.map((i: any) => i.id),
  getCategsId: (state) => state.selected_categories.map((i: any) => i.id)
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationsList.PUSH_SELECTED_DATA](state, { obj, value }) {
    // @ts-ignore
    state[obj]?.push(value)
  },
  [MutationsList.DELETE_SELECTED_DATA](state, { value, obj }) {
    // @ts-ignore
    state[obj] = state[obj]?.filter((i: any) => i.id !== value.id)
  },
  [MutationsList.SET_CATEGORY_DATA](state, value) {
    state.categories = value
  },
  [MutationsList.SET_HASHTAGS_DATA](state, value) {
    state.hashtags = value
  },
  [MutationsList.PUSH_HASHTAGS_DATA](state, value) {
    // @ts-ignore
    state.hashtags.links = value.links
    // @ts-ignore
    state.hashtags.meta = value.meta
    // @ts-ignore
    state.hashtags.data.push(...value.data)
  },
  [MutationsList.SET_PER_PAGE](state, value) {
    state.per_page = value
  },
  [MutationsList.UPDATE_PER_PAGE](state, value) {
    state.per_page += value
  },
  [MutationsList.SET_CURR_PAGE](state, value) {
    state.curr_page = value
  },
  [MutationsList.SET_INITIAL_SELECTED](state) {
    state.selected_hashtags = []
    state.selected_categories = []
  },
  [MutationsList.SET_SORT_TYPE](state, value) {
    state.sort_type = value
  },
  [MutationsList.SET_INITIAL_SORT](state) {
    state.sort_type = 'recent'
  },
  [MutationsList.SELECT_FILTER](state) {
    state.selected_categories.length
      ? (state.isSelectedCategory = state.selected_categories.length)
      : (state.isSelectedCategory = 0)
    state.selected_hashtags.length
      ? (state.isSelectedHashtag = state.selected_hashtags.length)
      : (state.isSelectedHashtag = 0)
    state.isSelected = state.isSelectedCategory + state.isSelectedHashtag
  },
  [MutationsList.CLEAR_SELECT_FILTER](state) {
    state.isSelected = 0
  },
  [MutationsList.SET_COUNT](state) {
    state.showCount = true
  },
  [MutationsList.DELETE_COUNT](state) {
    state.showCount = false
  },
  [MutationsList.SET_INITIAL_STATE](state) {
    state.selected_hashtags = []
    state.categories = {}
    state.selected_categories = []
    state.hashtags = {}
    state.search_params = ''
    state.current_params = ''
    state.curr_page = 1
    state.per_page = 0
    state.sort_type = 'recent'
    state.isSelectedCategory = 0
    state.isSelectedHashtag = 0
    state.isSelected = 0
    state.showCount = false
  }
}
