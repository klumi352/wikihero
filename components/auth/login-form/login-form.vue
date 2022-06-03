<template>
  <div class="form">
    <h2>{{ $t('login.title') }}</h2>
    <!-- - -->
    <div class="g-h3">{{ $t('login.intro') }}</div>
    <!-- - -->
    <v-input
      autocomplete="username"
      :value="userStore.email"
      :error="userErrors.email"
      name="email"
      type="email"
      :placeholder="$t('login.1st-placeholder')"
      :hint="$t('login.1st-hint')"
      @input="handleStore"
      @keypress.enter="login"
    />
    <v-input
      autocomplete="current-password"
      :value="userStore.password"
      :error="userErrors.password"
      name="password"
      type="password"
      :placeholder="$t('login.2st-placeholder')"
      :hint="$t('login.2st-hint')"
      @input="handleStore"
      @keypress.enter="login"
    />
    <!-- - -->
    <div class="a-tar--mobile">
      <fetch-loading :class="{ loading }"
        ><button class="continue g-btn" :disabled="loading" @click="login">
          {{ $t('login.continue') }}
        </button></fetch-loading
      >
      <!-- - -->
      <span class="hint g-h3 g-h3--mobile"
        >{{ $t('login.forgot') }}
        <nuxt-link to="#forgot" replace class="g-link">{{
          $t('login.forgot-btn')
        }}</nuxt-link>
      </span>
    </div>
    <!-- - -->
    <login-social />
    <!-- Call modal using hash #forgot -->
    <forgot-pass />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mt, Auth } from '@/store/auth'
import ForgotPass from '@/components/auth/forgot-pass/forgot-pass.vue'
import LoginSocial from '@/components/auth/login-social/login-social.vue'

export default Vue.extend({
  components: {
    ForgotPass,
    LoginSocial
  },
  computed: {
    ...mapState('auth', {
      userStore: (s) => (s as Auth).form,
      loading: (s) => (s as Auth).loading,
      userErrors: (s) => (s as Auth).errors.user
    })
  },
  beforeDestroy() {
    this.$store.commit(`auth/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`auth/${mt.CLEAR_FORM_ERROR}`)
  },
  methods: {
    handleStore(e: any) {
      /** clear errors */
      this.$store.commit(`auth/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`auth/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    login(): void {
      this.$store.dispatch(`auth/login`)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/form';
</style>
