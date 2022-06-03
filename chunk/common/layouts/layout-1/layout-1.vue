<template>
  <div class="l-1">
    <div class="g-container">
      <div v-if="withTitle" ref="title" class="w-col">
        <slot name="title" />
      </div>
      <div
        class="wrapper"
        :class="{
          noAsideHidden,
          paddingMin,
          noMinHeight,
          nestedLayout,
          lastOne
        }"
      >
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
  props: {
    noAsideHidden: Boolean,
    paddingMin: Boolean,
    noMinHeight: Boolean,
    nestedLayout: Boolean,
    lastOne: Boolean,
    withTitle: Boolean
  },
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
@import 'layout-1';
</style>
