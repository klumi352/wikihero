<template>
  <fieldset
    :class="{ 'with-error': error, minimal, activatedIfFill, isFocus }"
    class="input-wrapper"
  >
    <label class="label" :class="{ modif }">
      <textarea
        ref="inp"
        rows="6"
        class="input"
        @keypress.enter="keyEnter"
        v-bind="{ ...$attrs }"
        v-on="{ ...$listeners }"
      />
      <span class="placeholder">{{ placeholder }}</span>
      <span v-if="hint" class="hint">{{ hint }}</span>
      <button
        v-if="withCopy"
        class="g-t-btn copy-btn"
        @click="
          $copyTextToClipboard($refs.inp.value).then(
            $notification.success('copied')
          )
        "
      >
        <icon-copy width="20" height="20" />
      </button>
    </label>
    <span v-if="error" class="error">{{ error }}</span>
  </fieldset>
</template>

<script lang="ts">
/* eslint-disable no-unused-expressions */
import Vue from 'vue'
const isTouch = (): boolean => (window as any).Modernizr.touchevents

export default Vue.extend({
  inheritAttrs: false,
  props: {
    gettingInput: {
      type: Function,
      default() {
        return () => {}
      }
    },
    withCopy: Boolean,
    activatedIfFill: Boolean,
    minimal: Boolean,
    hint: String,
    error: String,
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isFocus: false,
      modif: false
    }
  },
  created() {
    const vm = this
    if (vm.$attrs.value) vm.modif = true
  },
  methods: {
    keyEnter(): void {
      // @ts-ignore
      if (isTouch()) this.$refs.inp?.blur()
    }
  },
  mounted(): any {
    const vm = this
    vm.gettingInput(vm.$refs.inp)
    function inputCallback({ target }: any): void {
      vm.modif = !!target.value
    }
    function focusCallback({ type }: any): void {
      switch (type) {
        case 'focus': {
          vm.isFocus = true
          document.body.classList.add('g-in-focus')
          break
        }
        case 'blur': {
          vm.isFocus = false
          document.body.classList.remove('g-in-focus')
          break
        }
      }
    }

    vm.$watch('$attrs.value', (value) => {
      vm.modif = !!value
    })

    inputCallback({ target: vm.$refs.inp })
    ;(vm.$refs.inp as HTMLElement).addEventListener('input', inputCallback)
    ;(vm.$refs.inp as HTMLElement).addEventListener('focus', focusCallback)
    ;(vm.$refs.inp as HTMLElement).addEventListener('blur', focusCallback)
    vm.$once('hook:beforeDestroy', () => {
      ;(vm.$refs.inp as HTMLElement).removeEventListener('input', inputCallback)
      ;(vm.$refs.inp as HTMLElement).removeEventListener('focus', focusCallback)
      ;(vm.$refs.inp as HTMLElement).removeEventListener('blur', focusCallback)
    })
  }
})
</script>

<style lang="scss" scoped>
@import 'v-textarea';
</style>
