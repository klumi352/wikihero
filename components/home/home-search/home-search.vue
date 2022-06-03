<template>
  <section class="container" :class="{ withMargin: !noMargin }">
    <div class="wrapper">
      <nuxt-link class="input" to="/search">
        <div class="g-h3">
          {{ $t('home.search-result') }}
        </div>
        <icon-search class="icon" width="16" height="16" />
      </nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    noMargin: Boolean
  }
})
</script>

<style lang="scss" scoped>
@import 'home-search';
</style>
