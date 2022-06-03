<template>
  <div class="layout" :class="{ noMinHeight, nestedLayout, lastOne }">
    <div class="layout__container">
      <!-- <div class="layout__wrapper"> -->
      <!--  -->
      <div class="layout__container-chunk"></div>
      <!--  -->
      <div class="layout__container-main">
        <!--  -->
        <div v-if="withTitle" ref="title" class="w-col">
          <slot name="title" />
        </div>
        <!--  -->
        <div ref="main" class="layout__main-wrap">
          <slot></slot>
        </div>
      </div>
      <!--  -->
      <div class="layout__container-chunk">
        <div
          ref="aside"
          class="layout__chunk-wrap"
          :class="{ withTitle, topUse }"
        >
          <slot name="aside"></slot>
        </div>
      </div>
    </div>
    <!--  -->
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    noMinHeight: Boolean,
    nestedLayout: Boolean,
    lastOne: Boolean,
    withTitle: Boolean,
    topUse: Boolean
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
@import 'layout-3';
</style>
