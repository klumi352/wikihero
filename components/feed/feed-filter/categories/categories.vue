<template>
  <div class="filter__categories a-df a-fdc">
    <div class="filter__subtitle">
      <div class="filter__subtitle-wrap">
        <h4 class="a-ffr">{{ $t('filter.categories-title') }}</h4>
      </div>
    </div>

    <ul v-if="categoriesList">
      <li
        v-for="(item, index) in categoriesList.data"
        :key="index"
        class="a-df a-fdc"
      >
        <!-- Category button -->
        <button
          :ref="`category-feed-${index}`"
          class="filter__category a-ffr"
          :class="{
            active: !!checkExist({
              value: item.id,
              obj: 'selected_categories'
            })
          }"
          @click="handleSelectCategory(item, index)"
        >
          {{ item.title }}
          <span>{{ item.posts }}</span>
          <span class="close"></span>
        </button>
        <!-- --- -->
        <p class="a-ffr">{{ item.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../feed-filter.scss';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapState, mapGetters } from 'vuex'
export default {
  model: {
    prop: 'selected',
    event: 'update-selected'
  },
  props: {
    categories: Array,
    selected: Array
  },
  computed: {
    ...mapState({
      categoriesList: (state) => state.filter.categories
    }),
    ...mapGetters('filter', [
      'checkExist',
      'checkMeta',
      'categoriesQuery',
      'getCategsId'
    ])
  },
  methods: {
    handleSelectCategory(v, i) {
      const vm = this
      !vm.checkExist({ value: v.id, obj: 'selected_categories' })
        ? vm.$store.commit('filter/PUSH_SELECTED_DATA', {
            obj: 'selected_categories',
            value: v
          })
        : vm.$store.commit('filter/DELETE_SELECTED_DATA', {
            value: v,
            obj: 'selected_categories'
          })
    }
    // handleRemoveCategory(v, i) {
    //   const vm = this
    //   vm.$store.commit('filter/DELETE_SELECTED_DATA', {
    //     value: v,
    //     obj: 'selected_categories'
    //   })
    // }
  }
}
</script>
