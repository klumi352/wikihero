<template>
  <div class="l-1">
    <div class="g-container">
      <div class="wrapper">
        <div ref="main" class="l-col">
          <slot />
        </div>
        <div ref="aside" class="r-col">
          <slot name="aside" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  localObserver() {
    return {
      collection: () => [
        ...this.$refs.main.children,
        ...this.$refs.aside.children
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'layout-2';
</style>
