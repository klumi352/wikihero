<template>
  <li class="hashtag-item">
    <div class="hashtag-item__title highlight-wrap" v-html="processedName" />
    <div
      class="hashtag-item__desc highlight-wrap"
      v-html="processedDescription"
    />
  </li>
</template>

<style lang="scss" scoped>
@import 'item';
</style>

<script>
import { SearchResultItemMixin } from '~/plugins/vue-extend/mixins/-search-result-item-mixin'

export default SearchResultItemMixin().extend({
  computed: {
    processedName() {
      return this.item.name
    },
    processedDescription() {
      return this.item.description
    }
  }
})
</script>
