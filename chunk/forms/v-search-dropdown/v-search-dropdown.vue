<template>
  <div
    v-click-outside="hide"
    class="header-search"
    :class="{ focused: isFocus }"
    @click="open"
  >
    <input
      ref="search"
      :value="propSearch"
      type="text"
      :placeholder="isFocus ? 'Search tags' : $t('header.search')"
      @input="handler($event)"
    />
    <icon-search />
    <div class="header-search-dropdown" :class="{ open: isFocus }">
      <ul v-if="dataLength === 0" class="dropdown-list">
        <li class="dropdown-list-item-noResult a-ffr">
          {{ $t('filter.hashtag-noresult') }}
        </li>
      </ul>
      <ul v-else class="dropdown-list">
        <li
          v-for="(item, key) in propData"
          :key="key"
          class="dropdown-list-item a-df a-fdc"
          :class="{
            selected: !!checkExist({
              value: item.id,
              obj: 'selected_hashtags'
            })
          }"
          @click="spitValue(item)"
        >
          <span class="dropdown-list-name a-ffr">{{ item.name }}</span>
          <span class="dropdown-list-description a-ffr">{{
            item.description
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    propData: [Object, Array],
    propSearch: [String]
  },
  data: () => ({
    isFocus: false,
    search: '',
    data: []
  }),
  computed: {
    dataLength() {
      return this.propData?.length
    },
    ...mapState('filter', ['selected_hashtags']),
    ...mapGetters('filter', ['checkExist'])
  },
  created() {
    this.search = this.propSearch
  },
  methods: {
    open(): void {
      !this.isFocus
      this.isFocus = true
    },
    hide(): void {
      this.isFocus = !!this.search || false
    },
    handler(e: any) {
      this.$emit('input', e.target.value)
    },
    spitValue(v: any) {
      const vm = this as any
      vm.$emit('spit', v)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-search-dropdown';
</style>
