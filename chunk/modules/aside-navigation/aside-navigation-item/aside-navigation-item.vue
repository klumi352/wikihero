<template>
  <ul v-if="data">
    <li
      v-for="item in data"
      :key="item.id"
      :title="item.name"
      class="explorer-item"
      :class="[maxDeep ? `global-nest-${maxDeep}` : null]"
    >
      <div
        class="explorer-item-wrap"
        :class="[
          currentClass,
          `nest-${nest + 1}`,
          {
            visible: getEpandingSlugs().includes(item.slug),
            opened: item.children
          }
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
          :to="'/' + overallSlug + '/' + item.slug"
        >
          {{ item.name }}</nuxt-link
        >
        <button
          :disabled="
            !Boolean(item.has_children) ||
              getEpandingSlugs().includes(item.slug)
          "
          class="g-extend-btn explorer-btn"
          @click="() => expand(item.slug)"
        >
          <icon-arrow
            class="arrow"
            :class="{
              'g-hidden': !Boolean(item.has_children),
              expand: Boolean(item.children)
            }"
          />
        </button>
      </div>

      <div v-if="item.children">
        <aside-navigation-item
          :nest="nest + 1"
          :overall-slug="overallSlug"
          :data="item.children"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  provide() {
    const vm = this as any
    let result = {}
    /**
     * result is parent of all children */
    if (vm.topDeep) result = { god: () => vm }
    return result
  },
  inject: ['expand', 'getEpandingSlugs', 'god'],
  name: 'AsideNavigationItem',
  props: ['overallSlug', 'data', 'nest', 'top-deep'],
  data() {
    return {
      openedIds: []
    }
  },
  created() {
    if (process.server) return

    const vm = this as any
    const pushData = { nest: vm.nest, id: vm._uid }
    const god = vm.god?.()
    if (
      god &&
      (!god.openedIds.length ||
        god.openedIds.find((i: typeof pushData) => i.nest <= pushData.nest))
    ) {
      god.openedIds.push(pushData)
      vm.$once('hook:beforeDestroy', () => {
        god.openedIds = god.openedIds.filter((i: any) => i !== pushData)
      })
    }
  },
  computed: {
    maxDeep(): number {
      let deepsArray = []
      const vm = this as any
      const god = vm?.god?.()
      if (god) {
        deepsArray = god.openedIds.map((i: any) => i.nest)
      }
      return Math.max(0, ...deepsArray)
    },
    currentClass(): string {
      const vm = this as any
      return (vm.nest + 1) % 2 ? 'odd' : 'even'
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'aside-navigation-item';
</style>
