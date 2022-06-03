<template>
  <modal-view
    key="ask-question"
    ref="modal"
    v-slot="{ isOpen }"
    name="ask-question"
  >
    <no-search-result v-if="isOpen" no-padding />
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'
import NoSearchResult from '@/components/topics/__modals/no-search-result/no-search-result.vue'

export default Vue.extend({
  components: {
    NoSearchResult
  },
  methods: {
    open(): void {
      // @ts-ignore
      this.$refs.modal?.open()
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'ask-question';
</style>
