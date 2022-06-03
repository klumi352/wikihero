<template>
  <div ref="modalWrapper" style="display: none;">
    <div
      ref="modal"
      class="modal"
      :class="[
        { 'g-modal-closing': closing, wide, mini, extraWide, noOverflow },
        { 'like-filter': likeFilter },
        { 'like-feed-filter': likeFilterFeed }
      ]"
    >
      <button
        v-if="!noClose"
        :title="$t('modal.close')"
        class="fixed-close g-t-btn"
        @click="close({ withClick: true })"
      >
        <icon-close width="15" height="15" />
      </button>
      <div v-if="isOpenAsync" class="content">
        <div class="inside">
          <div
            class="overlay"
            @click="noClose ? '' : close({ withClick: true })"
          ></div>
          <div ref="main" class="main">
            <button
              v-if="!noClose"
              :title="$t('modal.close')"
              class="close g-t-btn"
              @click="close({ withClick: true })"
            >
              <icon-close width="15" height="15" />
            </button>
            <slot :isOpen="isOpen || isOpenAsync" :calledData="calledData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mt } from '@/store/ui'

const PROCESING_CLOSE = 400
let popupUids: Array<number> = []
let popupNames: Array<string> = []
const $html: any = process.client && document.documentElement
const $body: any = process.client && document.body

export default Vue.extend({
  props: {
    extraWide: Boolean,
    wide: Boolean,
    mini: Boolean,
    noOverflow: Boolean,
    noClose: Boolean,
    name: {
      type: String,
      required: true
    } as PropOptions<string>,
    likeFilter: Boolean,
    likeFilterFeed: Boolean
  },
  data() {
    return {
      isOpen: false,
      calledData: null,
      isOpenAsync: false,
      closing: false
    }
  },
  watch: {
    isOpen(value) {
      const vm = this
      vm.$store.commit(`ui/${mt.SET_MODAL_NAME}`, vm.name)

      if (!value) {
        vm.closing = true
        setTimeout(() => {
          vm.isOpenAsync = value
          vm.closing = false
        }, PROCESING_CLOSE)
      } else {
        vm.isOpenAsync = value
        vm.focusOnWindow()
      }
    },
    $route() {
      this.hashChange()
    }
  },
  created() {
    const vm = this
    if (process.server) return

    const h = ({ name, data }: any) => {
      if (name === vm.name) {
        vm.open()
        vm.calledData = data
      }
    }

    vm.$root.$on('show-modal', h)
    vm.$once('hook:beforeDestroy', () => {
      vm.close({ delay: false })
      vm.$root.$off('show-modal', h)
    })
  },
  mounted() {
    const vm = this
    vm.$emit('onmounted', vm)

    vm.hashChange()
    const keyListener = vm.keyDown.bind(vm)
    document.addEventListener('keydown', keyListener)

    vm.$once('hook:beforeDestroy', () => {
      document.removeEventListener('keydown', keyListener)
    })
  },
  methods: {
    hashChange(): void {
      const vm = this
      if (vm.checkSimilarHash()) vm.open()
      else vm.close()
    },
    focusOnWindow(): any {
      const vm = this
      const main: any = vm.$refs.main
      if (main && main.focus) {
        main.focus()
      }
    },
    nullableHash(): void {
      window.location.hash = ''
    },
    checkSimilarHash(): boolean {
      const vm = this
      const componentName: string = vm.$props.name
      const currentHash = window.location.hash.slice(1)
      return componentName === currentHash
    },
    keyDown(): void {
      const vm = this
      if (
        popupUids.length > 1 &&
        /** check / popup was opened last */
        popupUids[popupUids.length - 1] !== vm._uid
      ) {
        return
      }

      const evt: any = window.event
      let isEscape: boolean = false
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc'
      } else {
        isEscape = evt.keyCode === 27
      }
      if (isEscape) {
        vm.close()
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _delete({ withClick = false }: any = {}): void {
      const vm = this
      const modal: any = vm.$refs.modal
      try {
        ;(vm.$refs.modalWrapper as HTMLElement).append(modal)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message)
      } finally {
        if (!popupUids.length) {
          $html.classList.remove('overflow')
          ;(window as any).__nuxt.classList.remove('overflow')
        }
        // if (withClick) vm.$emit('closed-with-click')
        vm.$emit('closed')
      }
    },
    close({ delay = true, withClick = false }: any = {}): void {
      const vm = this
      if (withClick) vm.$emit('closed-with-click')
      if (!vm.isOpen) return
      /* next step */
      popupNames = popupNames.filter((name) => name !== vm.name)
      popupUids = popupUids.filter((i) => i !== vm._uid)
      /** */
      vm.isOpen = false
      if (vm.checkSimilarHash()) vm.nullableHash()

      if (delay) {
        setTimeout(() => vm._delete({ delay, withClick }), PROCESING_CLOSE)
      } else {
        vm._delete({ delay, withClick })
      }
    },
    open(): void {
      const vm = this

      if (vm.isOpen || popupNames.includes(vm.name)) return
      /* next step */
      popupNames.push(vm.name)
      if (!popupUids.includes(vm._uid)) popupUids.push(vm._uid)
      /** */
      vm.isOpen = true
      $body.append(vm.$refs.modal)
      ;(window as any).__nuxt.classList.add('overflow')
      $html.classList.add('overflow')
      vm.$emit('opened')
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'modal-view';
</style>
