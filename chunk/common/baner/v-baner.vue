<template>
  <div class="baner">
    <div class="wrapper">
      <slot />
      <div class="head">
        <slot name="head" />
      </div>
      <slot name="intro" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
@import 'v-baner';
</style>
