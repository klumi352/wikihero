<template>
  <div
    class="v-tab"
    :class="{ small, wide, withoutBottomLine, dropMode, halfInMobile }"
  >
    <div :class="{ visible: loading }" class="loading">
      <img
        v-if="!dropMode"
        width="40"
        height="10"
        src="~assets/svg/icon-fetch.svg"
        alt=""
      />
    </div>
    <div v-if="!dropMode" class="fix-border">
      <ul ref="list">
        <li v-for="(item, k) in items" :key="k">
          <label role="button">
            <input
              ref="inp"
              :checked="k === defaultChecked"
              type="radio"
              :name="name"
              :value="item"
              :data-disabled="disabled"
              @change.prevent="change($event, k)"
            />
            <!-- @change.prevent.stop="change($event, k)" -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="button" v-html="item"></span>
          </label>
        </li>
      </ul>
    </div>
    <div v-else class="drop">
      <div class="placeholder g-h3">
        {{ hints[currTabIndex] }}
      </div>
      <button ref="btn" :title="$t('global.filter')" class="g-btn g-btn--dark">
        {{ $t('global.filter') }}
      </button>
      <div class="a-dn">
        <div ref="menu-buttons" class="filter-buttons" @click="close">
          <button
            v-for="(item, k) in items"
            :key="k"
            class="g-btn-drop"
            :class="{ active: currTabIndex === k }"
            @click="change($event, k)"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import tippy from 'tippy.js'

export default Vue.extend({
  props: {
    wide: Boolean,
    dropMode: Boolean,
    disabled: Boolean,
    small: Boolean,
    loading: Boolean,
    withoutBottomLine: Boolean,
    halfInMobile: Boolean,
    defaultChecked: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    hints: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currTabIndex: 0
    }
  },
  mounted() {
    const vm = this
    vm.scrollByIndex(vm.defaultChecked)
    vm.currTabIndex = vm.defaultChecked

    vm.$on('force-change', (index: number) => {
      const element = (vm.$refs.inp as any[])?.[index]
      vm.change(null, index)
      if (element) {
        element.checked = true
      }
    })

    const btn = vm.$refs.btn as Element
    if (btn) {
      const tippyInstance: any = tippy(btn, {
        appendTo: () => document.body,
        offset: [0, 5],
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
    close() {
      this.$emit('close')
    },
    scrollByIndex(index: number) {
      const vm = this
      if (!vm.dropMode) {
        if (index > 1) {
          ;(vm.$refs.list as HTMLElement).scrollTo({
            left: 1000,
            behavior: 'smooth'
          })
        } else {
          ;(vm.$refs.list as HTMLElement).scrollTo({
            left: 0,
            behavior: 'smooth'
          })
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change(event: any, index: number) {
      const vm = this

      /** If native event */
      if (event && window.Modernizr.vibrate) {
        window.navigator.vibrate(30)
      }

      vm.currTabIndex = index
      vm.scrollByIndex(index)
      vm.$emit('change', { index, vm })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-tab';
</style>
