<template>
  <section class="contributors-baner">
    <div class="contributors-baner__wrapper a-df a-jcsb">
      <div class="contributors-baner__left">
        <h2 class="contributors-baner__title g-h2-lg">
          {{ $t('contributors.title') }}
        </h2>
      </div>
      <div class="contributors-baner__right">
        <div class="contributors-baner__content-wrapper">
          <div class="contributors-baner__blockquote a-ffb">
            {{ $t('contributors.blockquote') }}
          </div>
          <!-- Deleted element by client "under question mark" - start -->
          <!-- <div class="contributors-baner__bottom a-df a-jcsb">
            <span class="contributors-baner__txt a-fz-12-15 a-ffr">
              {{ $t('global.contributors-subtitle') }}
            </span>
            <nuxt-link
              v-if="!loggedIn"
              class="contributors-baner__sign-up-btn a-ffb a-fz-12-14"
              :title="$t('header.login')"
              :to="`/login/?redirect=${$route.path}`"
            >
              {{ $t('header.login') }}
            </nuxt-link>
          </div> -->
          <!-- Deleted element by client "under question mark" - finish -->
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import 'contributors-baner';
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  }
})
</script>
