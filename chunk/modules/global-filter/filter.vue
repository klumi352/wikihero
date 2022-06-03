<template>
  <div id="groupPageFilter" class="filter">
    <div class="filter__main-wrap">
      <div class="filter__header">
        <h3 class="filter__header-title a-ffb">{{ $t('filter.title') }}</h3>
        <span class="filter__header-intro a-ffr">{{
          $t('filter.description')
        }}</span>
      </div>
      <div class="filter__categories a-df a-fdc">
        <div class="filter__subtitle">
          <div class="filter__subtitle-wrap">
            <h4 class="a-ffr">{{ $t('filter.categories-title') }}</h4>
          </div>
        </div>
        <ul>
          <li
            v-for="(category, index) in group_page.categories"
            :key="index"
            class="a-df a-fdc"
          >
            <button
              :ref="`category${index}`"
              class="filter__category a-ffr"
              :class="{
                active: !!checkExist({
                  value: category.id,
                  obj: 'selected_categories'
                })
              }"
              @click.prevent.self="setActiveCategory(category, index)"
            >
              {{ category.title }}
              <span>{{ category.posts_count }}</span>
              <span
                class="close"
                @click="closeActiveCategory(category, index)"
              ></span>
            </button>
            <p class="a-ffr">{{ category.description }}</p>
          </li>
        </ul>
      </div>
      <div class="filter__tags a-df a-fdc">
        <div class="filter__subtitle">
          <div class="filter__subtitle-wrap a-df a-jcsb a-aic">
            <h4 class="a-ffr">{{ $t('filter.tags-title') }}</h4>
            <SearchInput
              :prop-data="search_hashtags.data"
              :prop-search="searchForHashtag"
              @input="handle"
              @spit="spitValue"
            ></SearchInput>
          </div>
        </div>
        <div v-if="checkSelection" class="filter__select-wrap a-df a-fdc">
          <h4 class="a-ffb">{{ $t('filter.selection') }}</h4>
          <ul>
            <li
              v-for="(selectTag, index) in selected_hashtags"
              :key="index"
              class="a-df a-fdc"
            >
              <button
                class="a-ffr"
                @click="
                  DELETE_SELECTED_DATA({
                    value: selectTag,
                    obj: 'selected_hashtags'
                  })
                "
              >
                {{ selectTag.name }}
                <span>{{ selectTag.posts_count }}</span>
                <span class="close"></span>
              </button>
            </li>
          </ul>
        </div>
        <div class="filter__tags-wrap a-df a-fdc">
          <h4 class="a-ffb">{{ computedTitle }}</h4>
          <ul>
            <li
              v-for="(tag, index) in hashtags.data"
              :key="index"
              class="a-df a-fdc"
            >
              <button
                class="filter__tag a-ffr"
                :class="{
                  selected: !!checkExist({
                    value: tag.id,
                    obj: 'selected_hashtags'
                  })
                }"
                @click="push(tag, 'selected_hashtags')"
              >
                {{ tag.name }}
                <span>{{ tag.posts_count }}</span>
              </button>
            </li>
          </ul>
          <v-pagination
            v-if="!checkMeta"
            class="buttons"
            :meta="hashtags.meta"
            :loading="false"
            @change="pagination"
          />
        </div>
      </div>
    </div>
    <div class="filter__btns-wrap a-df a-jcsb">
      <button
        class="g-btn g-btn--dark"
        :disabled="!checkParamsSelected"
        @click="setInitial"
      >
        {{ $t('global.cancel') }}
      </button>
      <button
        class="g-btn g-btn--link"
        :disabled="!checkParamsSelected"
        @click="post"
      >
        {{ $t('global.confirm') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'filter';
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */

import Vue from 'vue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import SearchInput from '@/chunk/forms/v-search-dropdown/v-search-dropdown.vue'
import { MutationsList } from '@/store/filter'
import { Api } from '@/api.config'

type Params = {
  group_id: number
  hashtagsId: Array<number>
  q: string
  page: number
  categoriesId: Array<number>
  per_page: number
}

export default Vue.extend({
  components: {
    SearchInput
  },
  data() {
    return {
      searchForHashtag: '',
      currParams: '',
      query: '',
      curr_page: 1,
      search_hashtags: {},
      searchParams: ''
    }
  },
  watch: {
    async selected_categories(n: any, o: any) {
      const vm = this as any
      try {
        await vm.getHashtags({ group_id: vm.group_page.id })
      } catch (e) {
        throw e
      }
    },
    async selected_hashtags(n: any, o: any) {
      const vm = this as any
      try {
        await vm.getHashtags({ group_id: vm.group_page.id })
      } catch (e) {
        throw e
      }
    },
    searchForHashtag(n: any, o: any) {
      const vm = this as any
      vm.fetchSearch(n)
    }
  },
  computed: {
    ...mapState('group', ['group_page']),
    ...mapState('filter', [
      'selected_hashtags',
      'selected_categories',
      'hashtags',
      'isSelected'
    ]),
    computedTitle() {
      return this.selected_hashtags.length
        ? this.$t('filter.tags-selected-subtitle')
        : this.$t('filter.tags-subtitle')
    },
    ...mapGetters('filter', [
      'checkExist',
      'getHashtagsId',
      'checkMeta',
      'categoriesQuery',
      'getCategsId'
    ]),
    checkParamsSelected() {
      const vm = this as any
      return (
        vm.selected_hashtags?.length ||
        vm.selected_categories?.length ||
        vm.isSelected !== 0
      )
    },
    checkSelection() {
      return this.selected_hashtags.length
    }
  },
  created() {
    const vm = this as any
    vm.getHashtags({ group_id: vm.group_page.id })
  },
  mounted() {
    const vm = this as any
    this.$nextTick(() => {
      const appHeight = () => {
        const doc = document.querySelector('.like-filter')
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
      }
      window.addEventListener('resize', appHeight)
      vm.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', appHeight)
      })
      appHeight()
    })
    vm.fetchSearch()
  },
  methods: {
    ...mapMutations('filter', [
      'PUSH_SELECTED_DATA',
      'DELETE_SELECTED_DATA',
      'SET_HASHTAGS_DATA',
      'PUSH_HASHTAGS_DATA',
      'SET_PER_PAGE',
      'UPDATE_PER_PAGE',
      'SET_CURR_PAGE',
      'SET_INITIAL_SELECTED',
      'SELECT_FILTER',
      'CLEAR_SELECT_FILTER',
      'DELETE_COUNT',
      'SET_COUNT',
      'SET_INITIAL_SELECTED'
    ]),
    setActiveCategory(v: any, i: number) {
      const vm = this as any
      const isExist = vm.selected_categories.find((i: any) => i.id === v.id)
      if (isExist) {
        return vm.closeActiveCategory(v, i)
      }
      vm.push(v, 'selected_categories')
    },
    closeActiveCategory(v: any, i: number) {
      const vm = this as any
      vm.DELETE_SELECTED_DATA({ value: v, obj: 'selected_categories' })
    },
    push(v: any, obj: string) {
      const vm = this as any
      !vm.checkExist({ value: v.id, obj })
        ? vm.PUSH_SELECTED_DATA({ obj, value: v })
        : null
    },
    handle(v: any) {
      const vm = this as any
      vm.searchForHashtag = v
    },
    fetchSearch: debounce(async function(this: any, search: string = '') {
      // @ts-ignore
      const vm = this
      const s = search
      vm.query = s
      const params = {
        group_id: vm.group_page.id,
        categories_id: vm.getCategsId,
        q: vm.query
      }
      const result = await vm.$axios.get(Api.new.FILTER, { params })
      vm.search_hashtags = result
    }, Number(process.env.REQUEST_DEBOUNCE)),
    fetchSearch_: debounce(function(this: any, search: string = '') {
      // @ts-ignore
      const vm = this
      const s = search
      vm.query = s
      const params = {
        group_id: vm.group_page.id,
        categories_id: vm.getCategsId,
        q: vm.query
      }
      // return new Promise((resolve, reject) => {
      //   vm.$axios.get(Api.new.FILTER, { params }).then((result: Object) => {
      //     vm.search_hashtags = result
      //   })
      // })
      return vm.$axios
        .get(Api.new.FILTER, { params })
        .then((result: Object) => {
          vm.search_hashtags = result
        })
    }, Number(process.env.REQUEST_DEBOUNCE)),
    async pagination({ page }: any): Promise<void> {
      const vm = this as any
      const params = {
        group_id: vm.group_page.id,
        page,
        per_page: 10,
        categories_id: vm.getCategsId
      }
      const result = await vm.$axios.get(Api.new.FILTER, { params })
      vm.PUSH_HASHTAGS_DATA(result)
    },
    spitValue(v: any) {
      const vm = this as any
      vm.push(v, 'selected_hashtags')
    },
    post() {
      const vm = this as any
      this.$root.$showPreloader()
      vm.SELECT_FILTER()
      vm.$emit('post')
      vm.SET_COUNT()
      this.$router.go(-1)
      setTimeout(this.$root.$hidePreloader(), 4000)
    },
    setInitial() {
      const vm = this as any
      vm.CLEAR_SELECT_FILTER()
      vm.SET_INITIAL_SELECTED()
      vm.$store.dispatch('post/GET_POSTS_LIST', {
        id: vm.group_page.id
      })
      this.$router.go(-1)
    },
    /**
     * Main request to get hashtags
     */
    async getHashtags({
      group_id,
      hashtagsId = [],
      page = 1,
      q = '',
      categoriesId = [],
      per_page = 10
    }: Params) {
      const vm = this as any
      const params = {
        group_id: vm.group_page.id || group_id,
        hashtags_id: vm.getHashtagsId || hashtagsId,
        page,
        q,
        per_page,
        categories_id: vm.getCategsId || categoriesId
      }
      const result = await vm.$axios.get('/hashtags/filter', { params })
      vm.SET_HASHTAGS_DATA(result)
    }
  }
})
</script>
