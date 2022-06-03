<template>
  <div class="group-wrap">
    <h3 v-if="title" class="title">
      {{ title }}
    </h3>
    <ul ref="list" class="group-list">
      <item
        v-for="(item, index) in pagination.data"
        :key="index"
        :item="item"
      />
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
import Item from '@/components/group/group-list/item/item'
import { SearchResultListMixin } from '~/plugins/vue-extend/mixins/-search-result-list-mixin'

export default SearchResultListMixin().extend({
  components: {
    Item
  },
  props: {
    isLoading: Boolean
  },
  localObserver() {
    return {
      collection: () => [...this.$refs.list.children]
    }
  }
})
</script>

<style lang="scss" scoped>
.group-wrap {
  .title {
    line-height: 1.2;
    color: var(--c-black);
    letter-spacing: 0.01em;
    font-family: $f-medium;

    @include fluid-size('margin-bottom', 25px, 42px);
    @include fluid-size('font-size', 22px, 27px);
  }
}
</style>
