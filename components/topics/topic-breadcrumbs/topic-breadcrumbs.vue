<template>
  <!-- eslint-disable vue/no-v-html  -->
  <div>
    <div
      v-if="post_page.topic && $route.name === 'topic-group-post'"
      class="topic-breadcrumbs group-page"
    >
      <nuxt-link class="root-btn g-link" :to="`/${post_page.topic.slug}`"
        >{{ post_page.topic.title }}&nbsp;</nuxt-link
      >
      <span v-html="' > '"></span>
      <button ref="dot" :title="$t('sub.btn-pagination')" class="dot-btn">
        <icon-more width="20" height="20" />
      </button>
      <span v-html="' > '"></span>
      <span disabled class="current">&nbsp;{{ post_page.title }}</span>
      <span class="a-dn">
        <div ref="dot-buttons" class="dot-buttons" @click="close">
          <nuxt-link
            :to="`/${post_page.topic.slug}/${post_page.group.slug}`"
            class="g-btn-drop-middle"
          >
            {{ post_page.group.title }}
          </nuxt-link>
        </div>
      </span>
    </div>
    <div v-else class="topic-breadcrumbs group-page">
      <nuxt-link class="root-btn g-link" :to="`/`"
        >{{ $t('global.home') }}&nbsp;</nuxt-link
      >
      <span v-html="' > '"></span>
      <span disabled class="current">&nbsp;{{ topic.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import tippy from 'tippy.js'
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState('topic', ['topic']),
    ...mapState('group', ['group_page']),
    ...mapState('post', ['post_page']),
    modalTopics(): any[] {
      return this.topic.parents_deep?.slice(0, -1) || []
    }
  },
  mounted() {
    const vm = this
    const dot = vm.$refs.dot as HTMLElement

    if (dot) {
      const tippyInstance = tippy(dot, {
        appendTo: () => document.body,
        offset: [0, 5],
        placement: 'bottom',
        animation: 'fade',
        trigger: 'click',
        interactive: true,
        allowHTML: true,
        theme: 'drop'
      })
      ;(tippyInstance as any).popper
        .querySelector('.tippy-content')
        .append(vm.$refs['dot-buttons'])

      vm.$on('close', () => {
        tippyInstance.hide()
      })

      vm.$once('hook:beforeDestroy', () => {
        tippyInstance.destroy()
      })
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'topic-breadcrumbs';
</style>
