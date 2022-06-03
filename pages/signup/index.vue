<template>
  <div>
    <SignView />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { headGenerator } from '@/helpers/headGenerator'
const SignView = () => import('@/components/auth/sign-index/sign-index.vue')

export default Vue.extend({
  name: 'LoginPage',
  middleware: 'only-public',
  components: { SignView },
  globalObserver() {
    return {
      collection: () => this.$el.children
    }
  },
  head() {
    return Object.assign(
      headGenerator({
        name: this.$t('meta.registration-title')
      }),
      {
        bodyAttrs: { class: 'g-no-footer' }
      }
    )
  }
})
</script>

<style lang="scss" scoped></style>
