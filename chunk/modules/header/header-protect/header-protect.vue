<template>
  <div class="wrapper">
    <span class="link" :class="{ hidden: $route.name === 'signup' }">
      <nuxt-link
        :title="$t('header.signup')"
        :to="`/signup/?redirect=${$route.path}`"
        class="btn g-btn g-btn--link"
        >{{ $t('header.signup') }}</nuxt-link
      >
    </span>
    <span class="link" :class="{ hidden: $route.name === 'login' }">
      <nuxt-link
        :title="$t('header.login')"
        :to="`/login/?redirect=${$route.path}`"
        class="btn g-btn g-btn--dark"
        >{{ $t('header.login') }}</nuxt-link
      >
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
@import 'header-protect';
</style>
