<template>
  <header class="header" :class="{ isSubtopicPage }">
    <div v-if="!showSecondHeader" class="g-container container modificator">
      <div class="wrapper">
        <nuxt-link
          to="/"
          :title="$t('header.home')"
          class="logo-btn"
          :class="{ 'with-logo': isSubtopicPage }"
        >
          <icon-logo class="fill" />
          <span class="logo-txt">{{ $t('header.logo-txt') }} </span>
          <span class="beta">{{ $t('header.beta') }}</span>
        </nuxt-link>

        <span
          v-if="isSubtopicPage"
          class="logo-btn with-topic"
          @click="scrollTop"
        >
          <span class="logo-txt">{{ computedTitle }} </span>
        </span>
      </div>
      <header-controls />
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-else class="header__triple-container">
      <div class="a-df">
        <div class="header__container-chunk"></div>

        <div class="header__container-main">
          <!--  -->
          <!--  -->
          <!--  -->
          <!-- <div class="wrapper"> -->
          <div class="header__container-main--wrapper">
            <nuxt-link
              to="/"
              :title="$t('header.home')"
              class="logo-btn"
              :class="{ 'with-logo': isSubtopicPage }"
            >
              <icon-logo class="fill" />
              <span class="logo-txt">{{ $t('header.logo-txt') }} </span>
              <span class="beta">{{ $t('header.beta') }}</span>
            </nuxt-link>

            <span
              v-if="isSubtopicPage"
              class="logo-btn with-label"
              @click="scrollTop"
            >
              <span class="logo-txt">{{ computedTitle }} </span>
            </span>
          </div>
          <!-- </div> -->
          <div class="header__search-field">
            <div class="a-df a-aic">
              <header-search v-if="$route.name !== 'search'" />
            </div>
            <div class="header__search-hidden">
              <header-protect v-if="!loggedIn"></header-protect>
              <header-profile v-if="loggedIn"></header-profile>
            </div>
          </div>
          <!--  -->
          <!--  -->
          <!--  -->
        </div>

        <div class="header__container-chunk header__container-chunk--control">
          <div class="header__container-chunk--right-box">
            <header-protect v-if="!loggedIn"></header-protect>
            <header-profile v-if="loggedIn"></header-profile>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('topic', ['topicName']),
    ...mapGetters('group', ['groupName']),
    ...mapGetters('post', ['postName']),
    ...mapGetters('auth', ['loggedIn']),
    isSubtopicPage(): boolean {
      return ['topic-group-post', 'topic-group', 'topic', 'feed'].includes(
        this.$route.name as string
      )
    },
    showSecondHeader() {
      return [
        'topic-group-post',
        'topic-group',
        // 'topic',
        'feed',
        'search',
        'search'
      ].includes(this.$route.name as string)
    },
    computedTitle() {
      switch (this.$route.name) {
        case 'topic':
          return this.topicName
        case 'topic-group':
          return this.groupName
        case 'topic-group-post':
          return this.postName
        case 'feed':
          return this.$t('feed.section-title')
        default:
          return ''
      }
    }
  },
  methods: {
    scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'header-view';
</style>
