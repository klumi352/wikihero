<template>
  <li
    :data-follow="String(isFollow)"
    class="item"
    :class="{ followed: topic.is_follow }"
  >
    <div class="title ">
      <nuxt-link
        :to="slug"
        :target="withBlank && '_blank'"
        class="title-inside g-h2"
      >
        {{ topic.name }}
      </nuxt-link>
      <slot name="default">
        <button
          ref="follow"
          :disabled="procesing"
          class="info"
          @click="followCheck(topic)"
        >
          <span class="g-h3 foll foll--check">{{ $t('topic.following') }}</span>
          <span class="g-h3 foll foll--plus">{{ $t('topic.follow') }}</span>
          <span class="foll-count">{{
            resolveFollowCount
              | pluralize($t('sharer.followers'), $t('sharer.followers-plu'))
          }}</span>
          <icon-follow-plus class="ico ico--plus" />
          <icon-follow-check class="ico ico--check" />
        </button>
      </slot>
    </div>

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
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import tippy from 'tippy.js'

export default Vue.extend({
  props: {
    topic: Object,
    withBlank: Boolean
  },
  data() {
    return {
      isFollow: null,
      procesing: false
    }
  },
  computed: {
    ...mapGetters('auth', ['tempUser']),
    slug() {
      const slug = this.topic.overall_topic?.slug
      return 'overall_topic' in this.topic
        ? `/${slug ? slug + '/' : ''}${this.topic.slug}`
        : `/${this.$route.params.topic}/${this.topic.slug}`
    },
    resolveFollowCount() {
      const vm = this as any
      const initialCount = vm.topic.follow_users_count
      const initialFollow = vm.topic.is_follow
      const notNull = vm.isFollow !== null
      /** @inc */
      if (notNull && !vm.isFollow && initialFollow) {
        return initialCount - 1
      } else if (notNull && vm.isFollow && !initialFollow) {
        /** @dec */
        return initialCount + 1
      } else {
        /** @initial */
        return initialCount
      }
    }
  },
  mounted() {
    const vm = this
    const follow = vm.$refs.follow
    if (follow && vm.tempUser) {
      const tippyInstance: any = tippy(follow as Element, {
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
    followCheck(topic: any) {
      const vm = this as any
      if (this.tempUser) {
        // this.$router.push(`/signup/?redirect=${this.$route.fullPath}`)
      } else {
        vm.procesing = true
        if (vm.isFollow !== null) {
          topic = Object.assign({}, topic, { is_follow: vm.isFollow })
        }
        vm.changeFollow({ topic })
          .then((isFollow: any) => {
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
@import 'topic-item';
</style>
