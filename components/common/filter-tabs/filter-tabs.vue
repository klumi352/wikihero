<template>
  <div class="filter-tabs a-df a-jcsb">
    <v-select-checkbox
      ref="checkbox"
      class="mobile-filter-select"
      :name="checkboxName || 'type_id'"
      :select-title="selected.value"
      :list-data="filters"
      :store-value="selected.id"
      :mod="true"
      :modificator-group-page="true"
      :is-filter="true"
      @check="handleTypeChange"
    />
    <div class="filter-tabs__tabs">
      <ul class="a-df">
        <li
          v-for="(item, index) in data"
          v-show="!tempUser || item.key !== 'following'"
          :key="item.key"
          class="a-df a-aic"
          @click="$emit('sort', item.key)"
        >
          <button
            :class="itemClasses(item.key)"
            class="g-btn g-btn--link a-ffr"
          >
            {{ item.value }}
          </button>

          <span v-if="index !== data.length - 1" class="separator">&#183;</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'filter-tabs';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapGetters } from 'vuex'

export default {
  props: {
    data: Array,
    selected: Object,
    activeSort: String,
    checkboxName: String
  },
  data() {
    return {
      tippyInstance: ''
    }
  },
  computed: {
    filters() {
      return {
        data: this.data
      }
    },
    ...mapGetters('auth', ['tempUser'])
  },
  methods: {
    handleTypeChange({ value }) {
      this.$emit('sort', this.data.find((i) => i.id === value).key)
    },
    itemClasses(sort) {
      return {
        active: this.activeSort === sort
      }
    }
  }
}
</script>
