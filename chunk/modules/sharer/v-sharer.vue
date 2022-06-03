<template>
  <div>
    <div class="wrapper">
      <div
        v-if="['topic-subtopic', 'tip-id'].includes($route.name)"
        class="col"
      >
        <div class="g-h2">{{ resolveTopic.count_tips }}</div>
        <div class="g-h3 a-mb-15">
          {{
            resolveTopic.count_tips
              | pluralize($t('sharer.tip'), $t('sharer.tip-plu'), false)
          }}
        </div>
        <nuxt-link class="g-btn g-btn--fill" append to="#contribute-tip">
          {{ $t('sharer.create-tip') }}
        </nuxt-link>
      </div>
      <div v-if="$route.name === 'topic'" class="col">
        <div class="g-h2">{{ resolveTopic.count_sub_topics }}</div>
        <div class="g-h3 a-mb-15">
          {{
            resolveTopic.count_sub_topics
              | pluralize(
                $t('sharer.subtopic'),
                $t('sharer.subtopic-plu'),
                false
              )
          }}
        </div>
        <nuxt-link class="g-btn g-btn--fill" append to="#create-topic">
          {{ $t('sharer.create-subtopic') }}
        </nuxt-link>
      </div>
      <div class="col">
        <div class="g-h2">
          {{ resolveFollowCount }}
        </div>
        <div class="g-h3 a-mb-15">
          {{
            resolveFollowCount
              | pluralize(
                $t('sharer.followers'),
                $t('sharer.followers-plu'),
                false
              )
          }}
        </div>
        <!--  -->
        <button
          ref="follow"
          class="g-btn"
          :class="{
            'g-btn--outline': resolveFollow
          }"
          @click="followCheck"
        >
          {{ $t(`sharer.${resolveFollow ? 'unfollow' : 'follow'}`) }}
        </button>
        <!--  -->
      </div>
      <div class="col">
        <div class="g-h2">{{ resolveTopic.count_moderators }}</div>
        <div class="g-h3 a-mb-15">
          {{
            resolveTopic.count_moderators
              | pluralize(
                $t('sharer.moderators'),
                $t('sharer.moderators-plu'),
                false
              )
          }}
        </div>
        <nuxt-link class="g-btn" append to="#apply-moderator">
          {{ $t('sharer.apply') }}
        </nuxt-link>
      </div>
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
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import tippy from 'tippy.js'
import { Topic } from '@/store/topic'

export default Vue.extend({
  data() {
    return {
      isFollow: null,
      procesing: false
    }
  },
  computed: {
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

<style lang="scss" scoped>
@import 'v-sharer';
</style>
