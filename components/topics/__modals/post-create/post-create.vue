<template>
  <modal-view
    key="filter-modal"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="filter-modal"
    no-overflow
  >
    <div v-if="isOpen">
      <PostIndex @close-popup="close" />
    </div>
  </modal-view>
</template>

<style lang="scss" scoped>
@import 'post-create';
</style>

<script lang="ts">
import Vue from 'vue'
import PostIndex from '@/components/topics/__modals/post-create/post-index/post-index.vue'

export default Vue.extend({
  components: {
    PostIndex
  },
  methods: {
    open() {
      const vm = this as any
      vm.$refs.modal?.open()
    },
    close() {
      const vm = this as any
      vm.$refs.modal?.close()
    }
  }
})
</script>
