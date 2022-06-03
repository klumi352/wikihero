<template>
  <div>
    <reset-pass v-if="isReset" ref="forgot" />
    <confirm-user v-if="isConfirm" ref="confirm" />
    <reset-email v-if="isChangeEmail" ref="confirm" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ResetPass from '@/components/auth/reset-pass/reset-pass.vue'
import ResetEmail from '@/components/auth/reset-email/reset-email.vue'
import ConfirmUser from '@/components/auth/confirm-user/confirm-user.vue'

export default Vue.extend({
  validate({ query }) {
    return 'reset' in query || 'confirm' in query || 'change-mail' in query
  },
  components: {
    ResetPass,
    ResetEmail,
    ConfirmUser
  },
  data() {
    return {
      isReset: 'reset' in this.$route.query,
      isConfirm: 'confirm' in this.$route.query,
      isChangeEmail: 'change-mail' in this.$route.query
    }
  },
  mounted() {
    const vm = this as any
    if (vm.isReset) {
      vm.$refs.forgot.$refs.modal.open()
    } else if (vm.isChangeEmail) {
      vm.$refs.confirm.$refs.modal.open()
    }
  },
  head() {
    return {
      bodyAttrs: { class: 'g-no-footer' }
    }
  }
})
</script>

<style lang="scss"></style>
