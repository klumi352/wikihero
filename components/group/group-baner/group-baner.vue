<template>
  <div
    class="baner"
    :data-follow="String(isFollow)"
    :class="{ followed: group_page.user_subscribed }"
  >
    <div class="baner__main-wrap a-df">
      <div class="baner__avatar-wrap">
        <div class="baner__avatar-limit-wrap">
          <div class="baner__avatar-subwrap">
            <img
              :src="group_page.logo.original_url"
              alt=""
              class="baner__avatar"
            />
          </div>
        </div>
      </div>
      <div class="a-fg">
        <div class="baner__content-wrap a-df a-jcsb a-aic">
          <h1 class="baner__main-title new-h1">
            {{ group_page.title }}
          </h1>
          <!--  -->
          <button
            ref="follow"
            class="info"
            :class="{
              'g-btn--outline': resolveFollow
            }"
            @click="followCheck"
          >
            <span class="a-ffr">{{
              $t(`sharer.${resolveFollow ? 'unfollow' : 'follow'}`)
            }}</span>
            <icon-follow-plus class="ico ico--plus" />
            <icon-follow-check class="ico ico--check" />
          </button>
          <!--  -->
        </div>
        <p class="g-p" v-html="group_page.description"></p>
      </div>

      <div class="a-dn">
        <div ref="menu-buttons" class="filter-buttons">
          <nuxt-link
            :title="$t('header.signup')"
            :to="`/signup/?redirect=${$route.path}`"
            class="btn g-btn g-btn--link"
            >{{ $t('header.signup') }}</nuxt-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'group-baner';
</style>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import tippy from 'tippy.js'

export default Vue.extend({
  data() {
    return {
      isFollow: null,
      procesing: false
    }
  },
  computed: {
    resolveTopic() {
      if (this.group_page) return this.group_page
      else return {}
    },
    resolveFollow(): boolean {
      const vm = this as any
      if (vm.isFollow === null) return vm.resolveTopic.user_subscribed
      else return vm.isFollow
    },
    resolveFollowCount() {
      const vm = this as any
      const initialCount = vm.resolveTopic.count_followers
      const initialFollow = vm.resolveTopic.user_subscribed
      const notNull = vm.isFollow !== null
      /// 1
      if (notNull && !vm.isFollow && initialFollow) {
        return initialCount - 1
      }
      /// 2
      else if (notNull && vm.isFollow && !initialFollow) {
        return initialCount + 1
      }
      /// 3
      else {
        return initialCount
      }
    },
    ...mapState('group', ['group_page']),
    ...mapGetters('auth', ['tempUser'])
  },
  mounted() {
    const vm = this
    const follow = vm.$refs.follow
    if (follow && vm.tempUser) {
      const tippyInstance: any = tippy(follow as Element, {
        appendTo: () => document.body,
        placement: 'bottom',
        animation: 'fade',
        trigger: 'click',
        zIndex: 99,
        interactive: true,
        allowHTML: true,
        theme: 'drop'
      })
      tippyInstance.popper
        .querySelector('.tippy-content')
        .append(vm.$refs['menu-buttons'])

      vm.$on('close', () => {
        tippyInstance.hide()
      })

      vm.$once('hook:beforeDestroy', () => {
        tippyInstance.destroy()
      })
    }
  },
  methods: {
    ...mapActions('group', ['CHANGE_FOLLOW']),
    followCheck(groupValue: any) {
      const vm = this as any
      if (this.tempUser) {
      } else {
        vm.procesing = true
        if (vm.isFollow !== null) {
          groupValue = Object.assign({}, vm.resolveTopic, {
            user_subscribed: vm.isFollow
          })
        } else {
          groupValue = vm.resolveTopic
        }
        vm.CHANGE_FOLLOW({ group: groupValue })
          .then((isFollow: boolean) => {
            vm.isFollow = isFollow
          })
          .finally(() => {
            vm.procesing = false
          })
      }
    }
  }
})
</script>
