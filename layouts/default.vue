<template>
  <div>
    <div id="__content">
      <v-preloader />
      <!-- --- -->
      <admin-controll />
      <!-- --- -->
      <header-view />
      <main>
        <nuxt />
      </main>
      <footer-view />
    </div>

    <!-- --- aside-navigation module --- -->
    <aside-navigation />

    <client-only>
      <!-- --- global modals --- -->
      <global-modals />
      <!-- --- analytics module --- -->
      <analytics />
      <!-- --- notification module --- -->
      <notifications classes="g-notify" position="bottom right" />
      <!-- --- prompt module --- -->
      <v-prompt />
    </client-only>
    <sticky-mobile-nav />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState, mapActions } from 'vuex'

export default Vue.extend({
  provide() {
    return {
      isProd: process.env.NODE_ENV === 'production'
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['loggedInNoConfirm'])
  },
  mounted() {
    const vm = this
    if (vm.$route.name !== 'protect') {
      vm.showNotConfirmModal()
    }
  },
  methods: {
    ...mapActions('auth', ['showNotConfirmModal'])
  }
})
</script>

<style lang="scss" scoped></style>
