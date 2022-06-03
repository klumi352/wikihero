<template>
  <div class="g-container">
    <div ref="main" class="wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'layout-wide';
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  localObserver() {
    return {
      collection: () => [...this.$refs.main.children]
    }
  }
})
</script>
