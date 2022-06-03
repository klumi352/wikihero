<template>
  <div class="feed__header">
    <h2 class="feed__title">
      {{ $t('feed.section-title') }}
    </h2>
    <p>
      {{ $t('feed.section-description') }}
    </p>

    <div class="feed__control">
      <filter-tabs
        :data="tabs"
        :selected="tabs[0]"
        :active-sort="activeTab"
        @sort="handleSort"
      />

      <div class="feed__buttons">
        <ul class="a-df">
          <li class="a-df a-aic">
            <nuxt-link
              class="feed__filter-btn g-btn g-btn--link a-ffb"
              append
              :to="modalFilterKey"
              :class="filterButtonClasses"
            >
              <span v-if="isSelectedCount > 0" class="feed__selected-count">{{
                isSelectedCount
              }}</span>

              {{ $t('global.filter') }}
            </nuxt-link>

            <span class="separator">&#183;</span>
          </li>

          <li class="a-df a-aic poster">
            <button
              class="g-btn g-btn--link a-ffb"
              @click="handleOpenCreateForm"
            >
              {{ $t('global.post') }}
            </button>
          </li>
        </ul>
      </div>

      <feed-filter
        :is-selected="isSelectedCount"
        :is-special="isGroupSpecial"
        @validate="handleValidate"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'feed-header';
</style>

<script>
/* eslint-disable no-useless-catch */
/* eslint-disable require-await */
import { mapState } from 'vuex'
import FilterTabs from '@/components/common/filter-tabs/filter-tabs'
import FeedFilter from '@/components/feed/feed-filter/feed-filter'

export default {
  components: {
    FilterTabs,
    FeedFilter
  },
  props: {
    filters: Object
  },
  data() {
    return {
      tabs: [
        { id: 1, key: 'recent', value: this.$t('feed.recent-tab') },
        { id: 2, key: 'trending', value: this.$t('feed.trend-tab') },
        { id: 3, key: 'following', value: this.$t('feed.follow-tab') }
      ],
      activeTab: 'recent'
    }
  },
  computed: {
    filterButtonClasses() {
      return {
        selected: this.isSelectedCount > 0
      }
    },
    checkParamsSelected() {
      const vm = this
      return (
        vm.selectedHashtags?.length ||
        vm.selectedCategories?.length ||
        vm.isSelectedCount !== 0
      )
    },
    ...mapState({
      isSelectedCount: (state) => state.filter.isSelected,
      selectedCategories: (state) => state.filter.selected_categories,
      selectedHashtags: (state) => state.filter.selected_hashtags
    }),
    modalFilterKey() {
      return this.$route.query && this.$route.query.onboard
        ? '?onboard=true#feed-filter'
        : '#feed-filter'
    },
    isGroupSpecial() {
      return !!this.$route.query.filter
    }
  },
  methods: {
    handleSort(sort) {
      this.activeTab = sort
      this.$emit('update-sort', sort)
    },
    handleValidate() {
      this.$emit('validate')
    },
    handleOpenCreateForm() {
      this.$root.globalModals.createPost.open()
    }
  }
}
</script>
