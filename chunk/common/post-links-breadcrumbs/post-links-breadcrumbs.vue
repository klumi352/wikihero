<template>
  <li class="post-bc">
    <nuxt-link
      class="post-bc__link a-ffr"
      :to="`${propUrl}`"
      :class="[
        isGroup ? 'post-bc__link--group' : '',
        isCategory ? 'post-bc__link--category' : ''
      ]"
      >{{ propData }}</nuxt-link
    >
  </li>
</template>

<style lang="scss" scoped>
@import 'post-links-breadcrumbs';
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    propData: [String],
    isGroup: Boolean,
    isCategory: Boolean,
    propUrl: [String]
  }
})
</script>
