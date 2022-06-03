<template>
  <li
    class="group a-df"
    :data-follow="String(isFollow)"
    :class="{ followed: it.user_subscribed }"
  >
    <nuxt-link
      :to="it.computed_slug"
      class="group__link a-df a-aic a-jcsb a-fg"
    >
      <span class="group__title g-h2 a-ffm">{{ it.title }}</span>
    </nuxt-link>

    <!-- Follow button -->
    <div class="a-df a-aic">
      <button
        ref="follow"
        class="info"
        :class="{
          'g-btn--outline': resolveFollow
        }"
        @click="
          () => {
            followCheck()
            welcomeHandler()
          }
        "
      >
        <span class="a-ffr">{{
          $t(`sharer.${resolveFollow ? 'unfollow' : 'follow'}`)
        }}</span>
        <icon-follow-plus class="ico ico--plus" />
        <icon-follow-check class="ico ico--check" />
      </button>
    </div>

    <!--  -->

    <!-- Tippy popup -->
    <div class="a-dn">
      <div ref="menu-buttons" class="filter-buttons">
        <nuxt-link
          :title="$t('header.signup')"
          :to="`/signup/?redirect=${$route.path}`"
          class="btn-sign g-btn g-btn--link"
          >{{ $t('header.signup') }}</nuxt-link
        >
      </div>
    </div>
    <!--  -->
  </li>
</template>

<style lang="scss" scoped>
@import 'group-item.scss';
</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import tippy from 'tippy.js'
export default {
  props: {
    it: Object
  },
  data() {
    return {
      isFollow: null,
      procesing: false
    }
  },
  computed: {
    ...mapGetters('auth', ['tempUser']),
    resolveFollow() {
      const vm = this
      if (vm.isFollow === null) return vm.it.user_subscribed
      else return vm.isFollow
    },
    resolveFollowCount() {
      const vm = this
      const initialCount = vm.it.count_followers
      const initialFollow = vm.it.user_subscribed
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
    }
  },
  mounted() {
    const vm = this
    const follow = vm.$refs.follow
    if (follow && vm.tempUser) {
      const tippyInstance = tippy(follow, {
        appendTo: () => document.body,
        offset: [0, -10],
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
    followCheck(groupValue) {
      const vm = this
      if (this.tempUser) {
      } else {
        vm.procesing = true
        if (vm.isFollow !== null) {
          groupValue = Object.assign({}, vm.it, {
            user_subscribed: vm.isFollow
          })
        } else {
          groupValue = vm.it
        }
        vm.CHANGE_FOLLOW({ group: groupValue })
          .then((isFollow) => {
            vm.isFollow = isFollow
          })
          .finally(() => {
            vm.procesing = false
          })
      }
    },
    welcomeHandler() {
      if (this.$route.query && this.$route.query.special) {
        const items =
          localStorage.getItem('onboard') &&
          JSON.parse(localStorage.getItem('onboard'))
        if (items) {
          localStorage.setItem(
            'onboard',
            JSON.stringify({ ...items, special: true })
          )
        } else {
          localStorage.setItem('onboard', JSON.stringify({ special: true }))
        }
        this.$router.push('/feed')
      }
    },
    ...mapActions('group', ['CHANGE_FOLLOW'])
  }
}
</script>
