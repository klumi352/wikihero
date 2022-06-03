<template>
  <div class="confirm-user">
    <v-preloader />
  </div>
</template>

<script lang="ts">
import has from 'lodash/has'
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default Vue.extend({
  data() {
    return {
      currentStep: 0
    }
  },
  computed: {
    ...mapState('submit', ['form', 'loading', 'errors']),
    ...mapState('auth', ['user'])
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  mounted() {
    this.$root.$showPreloader()
    this.handle({
      target: {
        name: 'token',
        value: this.$route.query.confirm
      }
    })
    setTimeout(() => {
      this.sendRequest()
    }, 1000)
  },
  methods: {
    modalClose() {
      /** hard reload important */
      window.location.replace('/feed')
      this.$router.push('/feed')
      localStorage.setItem('onboard', '{}')
    },
    handle(e: any) {
      /** clear errors */
      this.$store.commit(`submit/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`submit/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    sendRequest(): void {
      this.$store
        .dispatch(`submit/send`, { path: Api.client.PROFILE_VERIFY })
        .then(() => {
          this.modalClose()
        })
        .catch(() => {
          if (has(this.errors, 'token') && this.errors.token) {
            this.$notification.error('token-expired')
          }
          setTimeout(() => {
            window.location.replace('/')
          }, 2000)
        })
        .finally(() => {
          this.$root.$hidePreloader()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'confirm-user';
</style>
