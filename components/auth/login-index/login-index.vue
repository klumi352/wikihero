<template>
  <div class="g-container g-aside-container">
    <div class="index auth-aside">
      <div class="main">
        <login-form />
      </div>
      <div class="secondary">
        <div
          v-once
          class="bg"
          :style="{
            backgroundImage: `url('${$t('$i.login.url')}')`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '@/components/auth/login-form/login-form.vue'

export default Vue.extend({
  components: {
    LoginForm
  }
})
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/index';
</style>
