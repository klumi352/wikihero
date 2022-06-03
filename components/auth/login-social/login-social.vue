<template>
  <div class="wrapper">
    <fetch-loading class="top" :class="{ loading: loadingFB }"
      ><button
        :disabled="loadingFB"
        class="g-btn g-btn--icon g-btn--fb"
        @click="loginFB"
      >
        {{ $t(`social.${$route.name}-facebook`) }}
      </button></fetch-loading
    >
    <fetch-loading class="top" :class="{ loading: loadingGoogle }"
      ><button
        :disabled="loadingGoogle"
        class="g-btn g-btn--icon g-btn--goo"
        @click="loginGoogle"
      >
        {{ $t(`social.${$route.name}-google`) }}
      </button></fetch-loading
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      loadingFB: false,
      loadingGoogle: false,
      isFBReady: false
    }
  },
  mounted() {
    this.isFBReady = Boolean(Vue.FB)
    window.addEventListener('fb-sdk-ready', this.onFBReady)
  },
  beforeDestroy() {
    window.removeEventListener('fb-sdk-ready', this.onFBReady)
  },
  methods: {
    async loginGoogle(): Promise<any> {
      const vm = this
      vm.loadingGoogle = true

      try {
        await vm.$gAuth.signOut()
      } finally {
        // TODO delete
        // eslint-disable-next-line no-console
        console.log('signIn Google', vm.$gAuth)
        vm.$gAuth
          .signIn()
          .then(
            (authData: any) => {
              /* google change sometimes path to access token */
              console.log({
                GOOGLE_ACCESS_TOKEN: authData
              })
              vm.$store
                .dispatch('auth/login', {
                  provider: 'google',
                  token: authData.vc.access_token
                })
                .then((r) => {
                  if (vm.$route.name === 'signup' && Boolean(r.active_popup)) {
                    localStorage.removeItem('onboard')
                    localStorage.setItem('onboard', '{}')
                  }
                })
            },
            (e: any) => {
              // eslint-disable-next-line no-console
              console.info(e, 'Google: cancel login')
            }
          )
          .finally(() => {
            vm.loadingGoogle = false
          })
      }
    },
    loginFB(): void {
      const vm = this
      vm.loadingFB = true

      Vue.FB.login(
        async function(response: any) {
          if (response.status === 'connected' && response.authResponse) {
            console.info('Facebook: enter login process')
            await vm.$store
              .dispatch('auth/login', {
                provider: 'facebook',
                token: response.authResponse.accessToken
              })
              .then((r) => {
                if (vm.$route.name === 'signup' && Boolean(r.active_popup)) {
                  localStorage.removeItem('onboard')
                  localStorage.setItem('onboard', '{}')
                }
              })
            console.info('Facebook: login')
          } else {
            // eslint-disable-next-line no-console
            console.info('Facebook: cancel login')
          }
          vm.loadingFB = false
        },
        { scope: 'public_profile,email' }
      )
    },
    onFBReady() {
      this.isFBReady = true
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'login-social';
</style>
