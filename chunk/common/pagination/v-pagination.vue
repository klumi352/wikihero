<template>
  <div v-if="isLastpage">
    <fetch-loading :class="{ loading }">
      <button :disabled="loading" class="g-btn g-btn--grey" @click="pagination">
        {{ count ? `${$t('global.more')} ${count}` : $t('global.reduce') }}
      </button>
    </fetch-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    meta: Object,
    loading: Boolean
  },
  computed: {
    isLastpage() {
      // eslint-disable-next-line camelcase
      return this.meta?.last_page > 1
    },
    count() {
      let result
      const meta = this.meta
      const diff = meta.total - meta.to
      if (Number(meta.per_page) < diff) {
        result = Number(meta.per_page)
      } else {
        result = diff
      }
      return result
    }
  },
  methods: {
    pagination() {
      const isRest = !!this.count
      this.$emit('change', {
        // eslint-disable-next-line camelcase
        page: isRest ? this.meta?.current_page + 1 : 1
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-pagination';
</style>
