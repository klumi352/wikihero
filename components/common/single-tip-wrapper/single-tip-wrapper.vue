<template>
  <li
    ref="item"
    class="tip-wrapper"
    :style="{ height }"
    :class="[classNames, { forceOpen }]"
    @mouseenter="!noEffects && mouseEnter()"
    @mouseleave="!noEffects && mouseLeave()"
  >
    <div ref="title" class="title-wrap">
      <div ref="title" class="title">
        <span class="title-inside g-h2">{{ it.name }}</span>
        <span class="info">
          <div class="found-usefull">
            <div v-if="!underLimit" class="g-h3 percent">
              {{ it.average_worked }}%
            </div>
            <br v-if="!underLimit" />
            {{ underLimit ? $t('tip.no-enough') : $t('tip.found-useful') }}
          </div>
          <div class="count-votes">
            {{
              !isVotes
                ? $t('tip.be-first')
                : $options.filters.pluralize(
                    it.count_voted,
                    $t('tip.votes'),
                    $t('tip.votes-plu')
                  )
            }}
          </div>
        </span>
      </div>
    </div>
    <nuxt-link
      v-if="noEffects && !forceOpen"
      target="_blank"
      :to="url"
      class="overlay"
    >
      <icon-close width="16" height="16" />
    </nuxt-link>
    <button v-if="!noEffects && !forceOpen" class="overlay" @click="open">
      <icon-close class="close-ico" width="16" height="16" />
    </button>
    <client-only>
      <div class="client-only"></div>
      <div ref="tip" class="tip">
        <single-tip
          :force-open="forceOpen"
          :under-limit="underLimit"
          :is-votes="isVotes"
          :it="it"
          @onmount="computeHeight"
        />
      </div>
    </client-only>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import SingleTip from '@/components/common/single-tip/single-tip.vue'
import sizes from '@/helpers/dom/sizes'

let lastOpened: any

export const defaultClassNames = () => ({
  enter: false,
  leave: false,
  opened: false
})

export const defaultHeight = () => 'auto'

// @@@ consts
const isTouch = () => (window as any).Modernizr.touchevents
type AsyncFunction = (event: any) => Promise<any> | void

export default Vue.extend({
  components: {
    SingleTip
  },
  props: {
    forceOpen: Boolean,
    noEffects: Boolean,
    it: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      limitTipPercent: process.env.LIMIT_TIP_PERCENT || 10,
      height: defaultHeight(),
      heightMin: defaultHeight(),
      classNames: defaultClassNames()
    }
  },
  computed: {
    ...mapState('tip', ['globalFilterType']),
    url() {
      const it = this.it
      return `/tip/${it.id}`
    },
    isVotes(): boolean {
      return this.it.count_voted > 0
    },
    underLimit(): boolean {
      return this.limitTipPercent > this.it.count_voted
    }
  },
  watch: {
    'classNames.opened'(opened: boolean) {
      const vm = this
      if (opened) {
        /* It means close tip */
        if (lastOpened && lastOpened !== vm) {
          lastOpened.classNames = defaultClassNames()
          lastOpened.height = defaultHeight()
        }

        setTimeout(() => {
          window.scrollTo({
            top: sizes.distanceTop(vm.$refs.item) - 130,
            behavior: 'smooth'
          })
        }, 0)

        lastOpened = vm
        this.$axios.put(Api.client.TIP_REGISTER_VIEW(vm.it.id)).catch(() => {
          Vue.notification.error('smth')
        })
      }
    }
  },
  mounted() {
    const vm = this

    if (vm.forceOpen) {
      vm.classNames.opened = true
    }

    vm.$watch('globalFilterType', () => {
      vm.height = defaultHeight()
      vm.classNames = defaultClassNames()
    })
  },
  methods: {
    computeHeight() {
      const vm = this
      vm.heightMin = isTouch()
        ? 'auto'
        : `${sizes.getAbsHeight(vm.$refs.tip)}px`
    },
    open() {
      const vm = this
      if (vm.noEffects) return
      if (vm.classNames.opened) vm.height = vm.heightMin
      vm.classNames.opened = !vm.classNames.opened
    },
    async mouseEnter(): Promise<any> {
      const vm = this
      if (isTouch()) return
      vm.classNames.leave = false
      vm.classNames.enter = true
      //
      vm.height = `${sizes.getAbsHeight(vm.$refs.title)}px`
      await vm.$nextTick()
      vm.height = `${sizes.getAbsHeight(vm.$refs.tip)}px`
    },
    async mouseLeave(): Promise<any> {
      const vm = this
      if (isTouch()) return
      // vm.classNames.opened = false
      vm.classNames.leave = true
      vm.classNames.enter = false

      if (vm.classNames.opened) return
      //
      vm.height = `${sizes.getAbsHeight(vm.$refs.tip)}px`
      await vm.$nextTick()
      vm.height = `${sizes.getAbsHeight(vm.$refs.title)}px`
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'single-tip-wrapper';
</style>
