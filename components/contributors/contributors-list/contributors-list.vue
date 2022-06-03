<template>
  <section class="contributors-list">
    <div class="contributors-list__wrapper">
      <h2 class="contributors-list__title a-ffr">
        {{
          $t('contributors.welcome-title-message').replace(
            '{target}',
            contributorsList.meta.total
          )
        }}
      </h2>
      <ul class="contributors-list__collection a-df a-fww">
        <li
          v-for="section in test"
          :key="`contributor${section.id}`"
          class="contributors-list__section"
        >
          <div class="contributors-list__section-link a-df a-aic">
            <div class="contributors-list__avatar-wrap a-df">
              <img
                :src="section.profile.avatar.original_url"
                alt=""
                class="contributors-list__avatar-img"
              />
            </div>
            <div class="contributors-list__user-info-wrap a-df a-jcc a-fdc">
              <div class="contributors-list__info-wrap a-df">
                <span
                  v-if="section.profile.first_name"
                  class="contributors-list__name a-ffr a-fz-18-20"
                  >{{ section.profile.first_name }}</span
                >
                <span
                  v-if="section.profile.last_name"
                  class="contributors-list__name a-ffr a-fz-18-20"
                  >{{ section.profile.last_name }}</span
                >
              </div>
              <div class="contributors-list__info-wrap a-df">
                <span
                  v-if="section.profile.job_title"
                  class="contributors-list__status a-fz-12-15 a-ffp"
                  >{{ section.profile.job_title }}</span
                >
                <span
                  v-if="section.profile.company"
                  class="contributors-list__link a-fz-12-15 a-ffp"
                  >&#64; {{ section.profile.company }}</span
                >
              </div>
              <span class="contributors-list__achievement a-fz-12-15 a-ffp">
                <span>{{ $t('contributors.people-helped-icon') }}</span>
                {{ section.people_helped_count }}
                {{ $t('contributors.people-helped-txt') }}</span
              >
              <span class="contributors-list__progress a-fz-12-15 a-ffp"
                ><span>{{ $t('contributors.contributions-count-icon') }}</span>
                {{ section.contributions_count }}
                {{ $t('contributors.contributions-count-txt') }}</span
              >
            </div>
          </div>
        </li>
      </ul>

      <client-only>
        <InfiniteLoading @infinite="handler">
          <div slot="spinner"></div>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </InfiniteLoading>
      </client-only>

      <!-- Hidden router link to contributor page @need if we will use this component in home page@ - start  -->
      <div
        v-if="usedInHomePage"
        class="contributors-list__hidden-wrap a-df a-jcc"
      >
        <nuxt-link
          to="/contributors"
          class="contributors-list__hidden-btn g-btn"
          >{{ $t('contributors.button') }}</nuxt-link
        >
      </div>
      <!-- Hidden router link to contributor page @need if we will use this component in home page@ - finish  -->
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import 'contributors-list';
</style>

<script>
import { mapState, mapActions } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'
export default {
  components: {
    InfiniteLoading
  },
  props: {
    usedInHomePage: Boolean,
    contributorsList: Object
  },
  computed: {
    ...mapState('contributors', ['test'])
  },
  methods: {
    ...mapActions('contributors', ['GET_TEST_DATA']),
    pagination({ page }) {
      const vm = this
      vm.$store.dispatch('contributors/GET_CONTRIBUTORS_DATA', {
        page
      })
    },
    async handler($state) {
      await this.GET_TEST_DATA()
      $state.complete()
    }
  }
}
</script>
