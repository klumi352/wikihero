<template>
  <div class="sharer">
    <div class="sharer__main-wrap">
      <span class="sharer__title a-ffb">{{ $t('group.sharer-title') }}</span>
      <!--  -->
      <div class="sharer__avatar-wrap a-df a-aic">
        <ul class="sharer__avatars-list a-df a-aic">
          <li
            v-for="(avatar, index) in avatars"
            :key="index"
            class="sharer__avatars-item"
          >
            <div
              class="sharer__avatar"
              :style="{
                backgroundImage: `url( ${avatar} )`
              }"
            ></div>
          </li>
        </ul>
        <span class="sharer__avatars-title a-ffr"
          >{{ subscribers_count }}
          {{
            subscribers_count
              | pluralize(
                $t('sharer.followers'),
                $t('sharer.followers-plu'),
                false
              )
          }}</span
        >
      </div>
      <!--  -->
      <div class="sharer__moderator-wrap a-df a-aic">
        <img :src="moderatorAvatar" alt="" class="sharer__moderator-avatar" />
        <div class="sharer__moderator-info">
          <span class="a-ffr"
            >{{ resolveTopic.count_moderators }}
            {{
              resolveTopic.count_moderators
                | pluralize(
                  $t('sharer.moderators'),
                  $t('sharer.moderators-plu'),
                  false
                )
            }}
            ·
          </span>
          <nuxt-link class="a-ffr g-link" append to="#apply-moderator">
            {{ $t('sharer.apply') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'group-sharer';
</style>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import tippy from 'tippy.js'
import { Topic } from '@/store/topic'

export default Vue.extend({
  props: {
    group_page: Object
  },
  data() {
    return {
      isFollow: null,
      procesing: false
    }
  },
  computed: {
    avatars() {
      const arr: any = []
      this.group_page.subscribers?.map((i: any) =>
        arr.push(i.profile?.avatar?.original_url)
      )
      return arr
    },
    moderatorAvatar() {
      return this.group_page.moderator_image?.original_url
    },
    subscribers_count() {
      return this.group_page?.subscribers_count
    },
    resolveTopic() {
      if (this.topic) return this.topic
      else return {}
    },
    resolveFollow(): boolean {
      const vm = this as any
      if (vm.isFollow === null) return vm.resolveTopic.is_follow
      else return vm.isFollow
    },
    resolveFollowCount() {
      const vm = this as any
      const initialCount = vm.resolveTopic.count_followers
      const initialFollow = vm.resolveTopic.is_follow
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
    ...mapState('topic', {
      topic: (state) => (state as Topic).topic
    }),
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
    followCheck(topic: any) {
      const vm = this as any
      if (this.tempUser) {
        // this.$router.push(`/signup/?redirect=${this.$route.fullPath}`)
      } else {
        vm.procesing = true
        if (vm.isFollow !== null) {
          topic = Object.assign({}, vm.resolveTopic, { is_follow: vm.isFollow })
        } else {
          topic = vm.resolveTopic
        }
        vm.changeFollow({ topic })
          .then((isFollow: boolean) => {
            vm.isFollow = isFollow
          })
          .finally(() => {
            vm.procesing = false
          })
      }
    },
    ...mapActions('topic', ['changeFollow'])
  }
})
</script>
