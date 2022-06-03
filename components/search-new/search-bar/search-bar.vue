<template>
  <div class="search-bar">
    <!-- Search top section -->
    <div class="search-bar__top a-df">
      <!-- Search input -->
      <SearchInput></SearchInput>
      <!--  -->

      <!-- Separator -->
      <div class="search-bar__separator"></div>
      <!--  -->

      <!-- Group dropdown -->
      <GroupDropdown></GroupDropdown>
      <!-- --- -->
    </div>
    <!-- Search bottom section -->
    <div class="search-bar__bottom">
      <!-- Result count -->
      <span class="search-bar__result-count a-ffr">{{
        takeResultCount
          | pluralize($t('search.result-singular'), $t('search.results'))
      }}</span>
      <!-- --- -->

      <div class="search-bar__select-box">
        <!-- Type result dropdown -->
        <TypeResultDropdown
          class="search-bar__dropdown search-bar__dropdown--type-result"
        ></TypeResultDropdown>
        <!-- --- -->

        <!-- Category dropdown -->
        <CategoryDropdown
          class="search-bar__dropdown search-bar__dropdown--category"
        ></CategoryDropdown>
        <!-- --- -->

        <!-- Hashtag dropdown -->
        <HashtagDropdown
          class="search-bar__dropdown search-bar__dropdown--hashtag"
        ></HashtagDropdown>
        <!-- --- -->
      </div>
    </div>
    <!-- --- -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/**
 * Component
 */
import HashtagDropdown from '@/components/search-new/search-bar/ui/hashtag-dropdown/hashtag-dropdown.vue'
import GroupDropdown from '@/components/search-new/search-bar/ui/group-dropdown/group-dropdown.vue'
import CategoryDropdown from '@/components/search-new/search-bar/ui/category-dropdown/category-dropdown.vue'
import TypeResultDropdown from '@/components/search-new/search-bar/ui/type-result-dropdown/type-result-dropdown.vue'
import SearchInput from '@/components/search-new/search-bar/ui/search-input/search-input.vue'
export default {
  components: {
    HashtagDropdown,
    GroupDropdown,
    CategoryDropdown,
    TypeResultDropdown,
    SearchInput
  },
  computed: {
    ...mapGetters('search', ['takeResultCount'])
  }
}
</script>

<style lang="scss" scoped>
@import './search-bar.scss';
</style>
