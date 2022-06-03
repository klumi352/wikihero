<template>
  <div ref="stepper" class="stepper" :class="{ noOverflow }">
    <div class="loading" :class="[{ show: loading__ }, preloaderPosition]">
      <img
        v-if="!noLoader"
        class="ico"
        width="60"
        height="60"
        src="~assets/svg/icon-preloader.svg"
        alt=""
      />
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import sizes from '@/helpers/dom/sizes'
declare module 'vue/types/vue' {
  interface Vue {
    $stepers: Array<any>
  }
}
declare interface BaseComponentData {
  loading__: boolean
}

export default Vue.extend({
  props: {
    preloaderPosition: {
      type: String,
      default: '',
      required: false,
      validator(v) {
        if (!v) return !0
        return ['top'].includes(v)
      }
    },
    noLoader: Boolean,
    noOverflow: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data(): BaseComponentData {
    return {
      loading__: false
    }
  },
  watch: {
    value(currentIndex, lastIndex): any {
      const vm = this
      lastIndex = lastIndex || 0
      vm.$stepers.forEach(
        (i: any) =>
          (i.transitionDir = currentIndex > lastIndex ? 'r-step' : 'l-step')
      )
      if (vm.value < 0) {
        return vm.$emit('input', 0)
      }
      if (vm.value >= vm.$stepers.length) {
        return vm.$emit('input', vm.$stepers.length - 1)
      }
      vm.showWithIndex(currentIndex, lastIndex)
    }
  },
  async mounted() {
    const vm = this
    await vm.$nextTick()
    vm.$stepers = Array.from(vm.$slots.default || []).reduce(
      (acc: any, app: any) => {
        if (app.componentInstance && app.tag.endsWith('v-step')) {
          acc.push(app.componentInstance)
        }
        return acc
      },
      []
    )
    vm.showWithIndex(vm.value, 0)
  },
  methods: {
    loading() {
      return {
        show: () => (this.loading__ = true),
        hide: () => setTimeout(() => (this.loading__ = false), 150)
      }
    },
    async showWithIndex(currentIndex: number, lastIndex: number): Promise<any> {
      const vm = this
      const setHeight = (x: string) => {
        const stepper = vm.$refs.stepper as HTMLElement
        if (stepper) stepper.style.height = x
      }

      this.$emit('input', currentIndex)
      /** Init proessing */

      await vm.$nextTick()
      vm.$stepers.forEach((el: any) => el.hide())
      vm.$stepers[currentIndex].show()
      /**
       * Set height for current
       */
      const lastEl = vm.$stepers[lastIndex].$el
      setHeight(`${sizes.getHeight(lastEl).offset}px`)
      /**
       * Set height for next
       */
      await vm.$nextTick()
      setTimeout(() => {
        const neededEl = vm.$stepers[currentIndex].$el
        setHeight(`${sizes.getHeight(neededEl).offset}px`)
        setTimeout(() => setHeight(`auto`), 300)
      }, 100)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-stepper';
</style>
