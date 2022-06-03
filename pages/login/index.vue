<template>
  <div>
    <LoginView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { headGenerator } from '@/helpers/headGenerator'
const LoginView = () => import('@/components/auth/login-index/login-index.vue')

export default Vue.extend({
  name: 'LoginPage',
  middleware: 'only-public',
  pageLoader: true,
  components: { LoginView },
  globalObserver() {
    return {
      collection: () => this.$el.children
    }
  },
  head() {
    return Object.assign(
      headGenerator({
        name: this.$t('meta.login-title')
      }),
      {
        bodyAttrs: { class: 'g-no-footer' }
      }
    )
  }
})
</script>

<style lang="scss" scoped></style>
