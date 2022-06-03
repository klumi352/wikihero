<template>
  <div class="feed__onboard">
    <div class="feed__onboard-close" @click="close">
      <icon-close />
    </div>
    <div class="feed__onboard-img">
      <img
        :src="$t('$i.success-add-tip.url')"
        :alt="$t('$i.success-add-tip.alt')"
      />
    </div>
    <div class="feed__onboard-title a-ffm">
      {{ replaceUser($t('feed.hi-text')) }}
    </div>
    <div class="feed__onboard-sub a-ffr">
      {{ $t('feed.steps-to-finish') }}
    </div>
    <div class="feed__onboard-steps">
      <!-- Step 1 -->
      <nuxt-link
        to="/experience-utilisateur-ux/wikihero/welcome-post-cybzrnjz2xnf?welcome=true"
        rel="noopener noreferrer"
        target="_blank"
        class="feed__onboard-step a-ffr"
      >
        <div class="step-txt">
          {{ $t('feed.step-welcome') }}
        </div>
        <div v-if="onboard && onboard['welcome']" class="step-icon">
          <icon-rounded-checker />
        </div>
        <div v-else class="step-icon arrow">
          <icon-arrow />
        </div>
      </nuxt-link>
      <!-- --- -->

      <!-- Step 2 -->
      <nuxt-link
        to="/experience-utilisateur-ux?special=true"
        rel="noopener noreferrer"
        target="_blank"
        class="feed__onboard-step a-ffr"
      >
        <div class="step-txt">
          {{ $t('feed.step-experience') }}
        </div>
        <div v-if="onboard && onboard['special']" class="step-icon">
          <icon-rounded-checker />
        </div>
        <div v-else class="step-icon arrow">
          <icon-arrow />
        </div>
      </nuxt-link>
      <!-- --- -->

      <!-- Step 3 -->
      <nuxt-link
        :to="'?filter=true#feed-filter'"
        class="feed__onboard-step a-ffr"
        @click.native="onboardHandler"
      >
        <div class="step-txt">
          {{ $t('feed.step-filter') }}
        </div>
        <div v-if="onboard && onboard['filter']" class="step-icon">
          <icon-rounded-checker />
        </div>
        <div v-else class="step-icon arrow">
          <icon-arrow />
        </div>
      </nuxt-link>
      <!-- Temporary comment: maybe 
      client will change his opinion 
      and it would be helpfull in future
       <nuxt-link
        to="/search?filter=true&category=39"
        class="feed__onboard-step a-ffr"
      >
        <div class="step-txt">
          {{ $t('feed.step-filter') }}
        </div>
        <div v-if="onboard && onboard['filter']" class="step-icon">
          <icon-rounded-checker />
        </div>
        <div v-else class="step-icon arrow">
          <icon-arrow />
        </div>
      </nuxt-link> -->
      <!-- --- -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    onboard: null
  }),
  computed: {
    ...mapState('auth', ['user'])
  },
  mounted() {
    this.setOnboard()
  },
  methods: {
    replaceUser(name) {
      return name.replace(
        '{name}',
        this.user?.profile?.first_name || this.user?.name
      )
    },
    onboardHandler() {
      const ls =
        localStorage.getItem('onboard') &&
        JSON.parse(localStorage.getItem('onboard'))
      if (ls) {
        localStorage.setItem('onboard', JSON.stringify({ ...ls, filter: true }))
      } else {
        localStorage.setItem('onboard', JSON.stringify({ filter: true }))
      }
      this.setOnboard()
    },
    setOnboard() {
      const ls = localStorage
      this.onboard = ls.getItem('onboard') && JSON.parse(ls.getItem('onboard'))
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'feed-onboarding';
</style>
