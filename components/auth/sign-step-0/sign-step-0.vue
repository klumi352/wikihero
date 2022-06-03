<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="form">
    <h3 class="form-title a-cblack a-ffm a-mb-0">
      {{ $t('sign.join-to-wiki') }}
    </h3>
    <!-- - -->
    <div class="g-h3 a-cblack">
      {{ $t('sign.companies-here') }}
    </div>
    <div class="form-logos a-df a-aic a-jcsb">
      <div class="form-logo-wrap">
        <img
          :src="$t('$i.sign-up-logo-1.url')"
          :alt="$t('$i.sign-up-logo-1.alt')"
        />
      </div>
      <div class="form-logo-wrap">
        <img
          :src="$t('$i.sign-up-logo-2.url')"
          :alt="$t('$i.sign-up-logo-2.alt')"
        />
      </div>
      <div class="form-logo-wrap">
        <img
          :src="$t('$i.sign-up-logo-3.url')"
          :alt="$t('$i.sign-up-logo-3.alt')"
        />
      </div>
    </div>
    <!-- - -->
    <v-input
      :value="userStore.email"
      :error="userErrors.email"
      name="email"
      type="email"
      :placeholder="$t('sign.2st-placeholder')"
      :hint="$t('sign.2st-hint')"
      @input="handleStore"
      @keypress.enter="submit"
    />
    <v-password
      :value="userStore.password"
      :error="userErrors.password"
      name="password"
      :placeholder="$t('sign.3st-placeholder')"
      :hint="$t('sign.3st-hint')"
      @input="handleStore"
      @keypress.enter="submit"
    />
    <v-password
      :value="userStore.password_confirmation"
      :error="userErrors.password_confirmation"
      name="password_confirmation"
      :placeholder="$t('sign.4st-placeholder')"
      :hint="$t('sign.4st-hint')"
      @input="handleStore"
      @keypress.enter="submit"
    />
    <!-- - -->
    <div class="a-tar--mobile">
      <fetch-loading :class="{ loading }"
        ><button :disabled="loading" class="continue g-btn" @click="submit">
          {{ $t('sign.continue') }}
        </button></fetch-loading
      >
      <!-- - -->
      <span class="hint g-h3 g-h3--mobile">
        {{ $t('sign.is-member') }}
        <nuxt-link class="g-link" to="/login">{{
          $t('sign.log-in')
        }}</nuxt-link></span
      >
    </div>

    <!-- - -->
    <login-social />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt, Auth } from '@/store/auth'
import LoginSocial from '@/components/auth/login-social/login-social.vue'

export default Vue.extend({
  components: {
    LoginSocial
  },
  data() {
    const vm = this
    return {
      isFromReward: vm.$router.currentRoute.query?.reward,
      mode: null
    } as {
      isFromReward: unknown
      mode: null | 'gmail' | 'basic'
    }
  },
  computed: {
    ...mapState('auth', {
      userStore: (s) => (s as Auth).form,
      loading: (s) => (s as Auth).loading,
      userErrors: (s) => (s as Auth).errors.user
    })
  },
  beforeDestroy() {
    this.$store.commit(`auth/${mt.CLEAR_FORM_ERROR}`)
  },
  mounted() {
    if (!this.isFromReward) {
      this.$analytic.trackers.goalRegistration.moveToPage()
    }
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
    async submit(): void {
      this.$store.dispatch('auth/loading', true)
      try {
        const { status } = await this.$axios.post(
          Api.client.SIGN_UP_VALIDATION,
          this.userStore
        )
        if (status) {
          this.$store.dispatch('auth/loading', false)
          this.$emit('changeIndex', 1)
        }
      } catch (e) {
        this.$store.dispatch('auth/loading', false)
        this.$store.commit(`auth/${mt.SET_FORM_ERROR}`, e.response.data)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/form';
</style>
