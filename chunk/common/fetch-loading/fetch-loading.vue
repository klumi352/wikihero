<template>
  <span class="fetch-loading" :class="$style.root">
    <slot />
    <img
      :class="[$style.ico, { [$style.light]: light }]"
      width="40"
      height="10"
      src="~assets/svg/icon-fetch.svg"
      alt=""
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    light: Boolean
  }
})
</script>

<style lang="scss" module>
@import 'fetch-loading';
</style>
