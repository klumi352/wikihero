<template>
  <modal-view
    key="feed-filter"
    ref="modal"
    v-slot="{ isOpen }"
    name="feed-filter"
    like-filter-feed
  >
    <div v-if="isOpen" id="feedPageFilter" class="filter a-pr">
      <div class="filter__main-wrap">
        <div class="filter__header">
          <h3 class="filter__header-title a-ffb">{{ $t('global.filter') }}</h3>
          <span class="filter__header-intro a-ffr">{{
            $t('filter.description')
          }}</span>
        </div>

        <categories-filter />

        <hashtags-filter
          @paginate="loadHashtagsClosure"
          @update-selected="selectedHandler"
        />
      </div>

      <div class="filter__btns-wrap a-df a-jcsb">
        <button
          class="g-btn g-btn--dark"
          :disabled="!checkSelectedParams"
          @click="cancel"
        >
          {{ $t('global.cancel') }}
        </button>
        <button
          class="g-btn g-btn--link"
          :disabled="!checkSelectedParams"
          @click="filter"
        >
          {{ $t('global.confirm') }}
        </button>
      </div>
      <div
        class="scrollTo"
        style="position: absolute; bottom: 0; left: 0"
      ></div>
    </div>
  </modal-view>
</template>

<style lang="scss" scoped>
@import 'feed-filter.scss';
</style>

<script lang="ts">
/* eslint-disable no-useless-catch */
import { mapState, mapGetters } from 'vuex'
// import { Api } from '~/api.config'
import CategoriesFilter from '@/components/feed/feed-filter/categories/categories'
import HashtagsFilter from '@/components/feed/feed-filter/hashtags/hashtags'

export default {
  components: {
    CategoriesFilter,
    HashtagsFilter
  },
  props: {
    isSelected: Number,
    isSpecial: Boolean
  },
  async fetch() {
    await Promise.all([this.loadCategories(), this.loadHashtagsClosure()])
  },
  data() {
    return {
      hashtagsPerPage: 10,
      filters: {
        hashtags: [],
        categories: []
      },
      hashtags: null,
      searchHashtags: null,
      specialCategory: {
        id: 39,
        title: 'Questions',
        description:
          'Pour poser et retrouver toutes les questions publiées dans le groupe',
        special: 1
      }
    }
  },
  computed: {
    checkSelectedParams() {
      return (
        this.selectedHashtags.length ||
        this.selectedCategories.length ||
        this.isSelectedCount !== 0
      )
    },
    ...mapGetters('filter', ['getHashtagsId', 'getCategsId', 'checkExist']),
    ...mapState({
      isSelectedCount: (state) => state.filter.isSelected,
      categoriesList: (state) => state.filter.categories,
      selectedCategories: (state) => state.filter.selected_categories,
      selectedHashtags: (state) => state.filter.selected_hashtags
    })
  },
  watch: {
    '$store.state.filter.selected_categories': {
      deep: true,
      async handler() {
        await this.loadHashtagsClosure()
      }
    }
  },
  mounted() {
    const fitlerQuery = this.$route.query && this.$route.query.special
    if (fitlerQuery) {
      !this.checkExist({ value: 39, obj: 'selected_categories' })
        ? this.$store.commit('filter/PUSH_SELECTED_DATA', {
            value: this.specialCategory,
            obj: 'selected_categories'
          })
        : null
      this.$store.commit('filter/SELECT_FILTER')
      this.$store.commit('filter/SET_COUNT')
      this.$emit('validate')
    }
    this.$watch(
      () => this.$refs.modal.isOpen,
      (val) => {
        if (val) {
          if (this.isSpecial) {
            this.checkOnboard()
          }
        }
      }
    )
  },
  methods: {
    checkOnboard() {
      const fitlerQuery = this.$route.query && this.$route.query.filter
      if (fitlerQuery) {
        !this.checkExist({ value: 39, obj: 'selected_categories' })
          ? this.$store.commit('filter/PUSH_SELECTED_DATA', {
              value: this.specialCategory,
              obj: 'selected_categories'
            })
          : null
        this.$store.commit('filter/SELECT_FILTER')
        this.$store.commit('filter/SET_COUNT')
        this.$emit('validate')
        setTimeout(() => {
          document
            .querySelector('.scrollTo')
            .scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 700)
      }
    },
    filter() {
      this.$router.go(-1)
      this.$store.commit('filter/SELECT_FILTER')
      this.$store.commit('filter/SET_COUNT')
      this.$emit('validate')
    },
    cancel() {
      this.$router.go(-1)
      this.$store.commit('filter/SET_INITIAL_SELECTED')
      this.$store.commit('filter/SELECT_FILTER')
      this.$store.commit('filter/SET_COUNT')
      this.$emit('validate')
    },
    async loadCategories() {
      const params = this.prepareCategoryParams('special')
      const pagination = await this.$axios.get('/feed-group-category', {
        params
      })
      this.$store.commit('filter/SET_CATEGORY_DATA', {
        data: pagination.data,
        meta: pagination.meta
      })
    },
    async selectedHandler() {
      await this.loadHashtagsClosure()
    },
    async loadHashtagsClosure(query = null, page = 1) {
      try {
        const params = this.prepareParamsHashtags(query, page)
        const response = await this.$axios.get('/hashtags/filter', {
          params
        })

        this.$store.commit('filter/SET_HASHTAGS_DATA', {
          data: response.data,
          meta: response.meta
        })
      } catch (e) {
        throw e
      } finally {
      }
    },
    prepareParamsHashtags(query, page) {
      return {
        categories_id: this.getCategsId,
        hashtags_id: this.getHashtagsId,
        page,
        per_page: 10,
        q: query,
        last_month: true
      }
    },
    prepareCategoryParams(sort) {
      return {
        order_by: sort
      }
    },
    mergePaginatedData(page, newData, oldData = []) {
      return page === 1 ? newData : [...newData, ...oldData]
    }
  }
}
</script>
