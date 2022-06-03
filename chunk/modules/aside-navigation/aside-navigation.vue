<template>
  <div
    @mouseenter="($event) => mouseHandler($event, { timeout: true })"
    @mouseleave="mouseHandler"
  >
    <button
      :class="{ visible: !isShow }"
      :disabled="isShow"
      :title="$t('aside-nav.lock')"
      class="g-extend-btn menu-button"
      @mouseenter="mouseHandler"
      @click="() => $store.commit(`ui/${mt.SET_VISIBILITY}`, !isShow)"
    >
      <div class="icon-wrap">
        <icon-menu
          :class="{ visible: !isHover && !isShow }"
          width="22"
          height="22"
        />
        <icon-fix
          :class="{ visible: isHover || isShow }"
          width="28"
          height="28"
        />
      </div>
      <span>{{ $t('aside-nav.menu') }}</span>
    </button>

    <div :class="{ isShow: isShow || isHover }">
      <div
        class="overlay"
        @click="() => $store.commit(`ui/${mt.SET_VISIBILITY}`, false)"
      ></div>

      <div class="root">
        <button
          class="g-extend-btn back-btn"
          @click="() => $store.commit(`ui/${mt.SET_VISIBILITY}`, false)"
        >
          <icon-back width="9" height="9" /> {{ $t('global.close') }}
        </button>

        <nuxt-link :title="$t('header.home')" class="logo" to="/">
          <icon-logo class="logo-fill" />
          <span class="logo-txt">{{ $t('header.logo-txt') }} </span>
        </nuxt-link>

        <ul class="main-list">
          <li>
            <nuxt-link class="link" to="/">{{ $t('global.home') }}</nuxt-link>
          </li>
          <li class="feed-link">
            <nuxt-link class="link" to="/feed">
              <span class="link-txt"
                >{{ $t('aside-nav.feed') }}
                <span v-if="missed_posts" class="notificate-circle-wrapper"
                  ><span class="notificate-circle a-ffr a-cwhite a-tac">{{
                    missed_posts
                  }}</span></span
                >
              </span>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link class="link" to="/contributors">
              <span class="link-txt">{{ $t('aside-nav.contributors') }} </span>
            </nuxt-link>
          </li>
          <li class="post-create-btn a-df">
            <button
              class="g-btn g-btn--fill"
              @click="
                () => {
                  $root.globalModals.createPost.open()
                }
              "
            >
              {{ $t('aside-nav.btn-post') }}
            </button>
          </li>
        </ul>

        <div class="explorer">
          <div class="g-h4 explorer-head">{{ $t('aside-nav.exp') }}</div>
          <ul v-if="asideData" class="explorer-list">
            <li
              v-for="overall in asideData"
              :key="overall.id"
              class="explorer-item"
              :title="overall.name"
            >
              <div
                class="explorer-item-wrap"
                :class="[
                  currentClass,
                  `nest-${nest}`,
                  { visible: expandingSlugs.includes(overall.slug) }
                ]"
              >
                <div class="explorer-overlay">
                  <img
                    width="40"
                    height="10"
                    src="~assets/svg/icon-fetch-dark.svg"
                    alt=""
                  />
                </div>
                <nuxt-link
                  class="link explorer-link"
                  :to="`${overall.computed_slug}`"
                  @click.native="routeToGroup()"
                >
                  {{ overall.title }}</nuxt-link
                >
                <!-- <button
                  :disabled="
                    !Boolean(overall.has_children) ||
                      expandingSlugs.includes(overall.slug)
                  "
                  class="g-extend-btn explorer-btn"
                  @click="() => expand(overall.slug)"
                >
                  <icon-arrow
                    :class="{
                      'g-hidden': !Boolean(overall.has_children),
                      expand: Boolean(overall.children)
                    }"
                    class="arrow"
                  />
                </button> -->
              </div>

              <div v-if="overall.children">
                <aside-navigation-item
                  :top-deep="true"
                  :nest="nest"
                  :overall-slug="overall.slug"
                  :data="overall.children"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { mt } from '@/store/ui'
let timer: any

export default Vue.extend({
  provide(): any {
    const vm = this
    return {
      getEpandingSlugs: () => vm.expandingSlugs,
      expand(combineSlug: string) {
        vm.expand(combineSlug)
      }
    }
  },
  data() {
    return {
      mt,
      nest: 1,
      expandingSlugs: []
    } as {
      nest: number
      expandingSlugs: string[]
    }
  },
  watch: {
    $route() {
      const vm = this
      ;(() => {
        /* For boot data in aside menu
         */
        const routeName = vm.$route.name
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { topic, subtopic } = vm.$route.params
        switch (routeName) {
          case 'topic': {
            // vm.boot({ combineSlug: `${topic}` })
            return
          }
          case 'topic-subtopic': {
            vm.boot({ initialLoad: true })
            // vm.boot({ combineSlug: `${subtopic}` })
          }
        }
      })()
      ;(() => {
        /* Only for mobile hide navigation
         */
        if (!(window as any).Modernizr.touchevents) return
        vm.$store.commit(`ui/${mt.SET_VISIBILITY}`, false)
      })()
    },
    isShow(isShow) {
      if (isShow) document.documentElement.classList.add('g-aside-nav')
      else document.documentElement.classList.remove('g-aside-nav')
    },
    isHover(isShow) {
      if (isShow) document.documentElement.classList.add('g-aside-nav-hover')
      else document.documentElement.classList.remove('g-aside-nav-hover')
    }
  },
  mounted() {
    const vm = this
    vm.boot({ initialLoad: true })
    vm.resizeMenuHandler()
    // const handler = throttle(vm.resizeMenuHandler.bind(this), 1000)
    // window.addEventListener('resize', handler)
    // vm.$once('hook:beforeDestroy', () => {
    //   window.removeEventListener('resize', handler)
    // })
  },
  methods: {
    routeToGroup() {
      this.SELECT_FILTER()
      this.CLEAR_SELECT_FILTER()
    },
    resizeMenuHandler() {
      const vm = this
      const siteWidth = window.innerWidth
      if (siteWidth > 1200) vm.$store.commit(`ui/${mt.SET_VISIBILITY}`, true)
      else vm.$store.commit(`ui/${mt.SET_VISIBILITY}`, false)
    },
    mouseHandler({ type }: Event, { timeout }: any = {}): void {
      const vm = this
      if ((window as any).Modernizr.touchevents) return

      switch (type) {
        case 'mouseenter':
          if (timeout) clearTimeout(timer)
          else vm.$store.commit(`ui/${mt.SET_HOVER}`, true)
          break
        case 'mouseleave':
          timer = setTimeout(() => {
            vm.$store.commit(`ui/${mt.SET_HOVER}`, false)
          }, 300)
          break
      }
    },
    async expand(combineSlug: string) {
      const vm = this
      vm.expandingSlugs.push(combineSlug)
      await this.boot({ combineSlug })
      setTimeout(() => {
        vm.expandingSlugs = [
          ...vm.expandingSlugs.filter((e) => e !== combineSlug)
        ]
      }, 500)
    },
    ...mapActions('ui', ['boot']),
    ...mapMutations('post', ['HANDLE_FORM_INPUT']),
    ...mapMutations('filter', ['CLEAR_SELECT_FILTER', 'SELECT_FILTER'])
  },
  computed: {
    ...mapState('auth', ['missed_posts']),
    ...mapGetters('ui', ['isShow', 'isHover', 'modalNames', 'asideData']),
    ...mapGetters('feed', ['checkNotifications']),
    ...mapState('group', ['group_page']),
    currentClass(): string {
      return this.nest % 2 ? 'odd' : 'even'
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'aside-navigation';
</style>
