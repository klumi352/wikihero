<template>
  <div class="group-tabs a-df a-jcsb">
    <div class="group-tabs__tabs">
      <v-select-checkbox
        class="mobile-filter-select"
        name="type_id"
        :select-title="selected.title"
        :list-data="filters"
        :store-value="selected.id"
        :mod="true"
        :modificator-group-page="true"
        :is-filter="true"
        @check="handleTypeChange"
      />

      <!-- Sorting bar section -->
      <SortingBar @sort="select"></SortingBar>
      <!-- --- -->
    </div>
    <div class="group-tabs__btns">
      <ul class="a-df">
        <li class="a-df a-aic">
          <nuxt-link
            class="group-tabs__filter-btn g-btn a-ffb"
            append
            to="#post-filter"
            :class="[isSelected > 0 ? 'selected' : '']"
          >
            <span v-if="isSelected > 0" class="group-tabs__selected-count">
              {{ isSelected }} {{ $t('filter.noun-button-message') }}
            </span>
            <span v-else>
              {{ $t('filter.verb-button-message') }}
            </span>
          </nuxt-link>
          <span class="separator">&#183;</span>
        </li>
        <li class="a-df a-aic poster">
          <button class="g-btn g-btn--link a-ffb" @click="post">
            {{ $t('global.post') }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'group-tabs';
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import SortingBar from '@/chunk/common/sorting-bar/sorting-bar.vue'
export default Vue.extend({
  components: {
    SortingBar
  },
  data() {
    return {
      isActive: false,
      tabs_local: [],
      categoriesCount: 0,
      hashtagsCount: 0,
      selected: {
        title: 'Posts Récents',
        order_by: 'recent',
        active: true,
        id: 0
      },
      filters: {
        data: [
          { title: 'Posts Récents', order_by: 'recent', active: true, id: 0 },
          { title: 'Tendances', order_by: 'trending', active: false, id: 1 },
          { title: 'Plus populaire', order_by: 'popular', active: false, id: 2 }
        ]
      }
    }
  },
  watch: {
    selected_hashtags: {
      deep: true,
      handler(oldValue, newValue) {
        if (oldValue.length > 0) this.hashtagsCount = 1
        else this.hashtagsCount = 0
      }
    },
    selected_categories: {
      deep: true,
      handler(oldValue, newValue) {
        if (oldValue.length > 0) this.categoriesCount = 1
        else this.categoriesCount = 0
      }
    }
  },
  computed: {
    ...mapState('filter', [
      'selected_hashtags',
      'selected_categories',
      'isSelected',
      'showCount'
    ]),
    currentCoresSelected() {
      const vm = this as any
      return vm.categoriesCount + vm.hashtagsCount
    }
  },
  methods: {
    handleTypeChange(e: any) {
      this.selected = {
        title: this.filters.data[e.value].title,
        order_by: this.filters.data[e.value].order_by,
        active: true,
        id: e.value
      }
      this.select(this.filters.data[e.value].order_by)
    },
    post() {
      const vm = this as any
      vm.$root.globalModals.createPost.open()
    },
    select(v: string) {
      const vm = this as any
      vm.$emit('sort', v)
    }
  }
})
</script>
