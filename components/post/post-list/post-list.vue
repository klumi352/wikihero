<template>
  <div class="comments-wrap">
    <h3 v-if="title" class="title">{{ title }}</h3>

    <slot name="header" />

    <ul>
      <item
        v-for="(item, index) in pagination.data"
        :key="index"
        force-open
        :post="item"
      />
      <div v-show="false"></div>
    </ul>

    <slot name="pagination">
      <v-pagination
        class="search-result__pagination"
        :meta="pagination.meta"
        :loading="isLoading"
        @change="handlePagination"
      />
    </slot>

    <slot v-if="!hasData" name="no-results">
      <div class="search-result__no-data">
        <span>{{ $t('search.no-data') }}</span>
      </div>
    </slot>
  </div>
</template>

<script>
import Item from '@/components/common/post-component/post-item'
import { SearchResultListMixin } from '~/plugins/vue-extend/mixins/-search-result-list-mixin'

export default SearchResultListMixin().extend({
  inject: ['mark'],
  components: {
    Item
  },
  props: {
    isLoading: Boolean
  }
})
</script>

<style lang="scss" scoped>
@import 'post-list';
</style>
