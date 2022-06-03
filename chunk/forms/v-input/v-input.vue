<template>
  <fieldset
    :class="{
      'with-error': error,
      success: success && !error,
      isFocus,
      noBorder,
      highlight,
      activatedIfFill,
      highlightError,
      maxLength: !!maxLength,
      postCreate
    }"
    class="input-wrapper"
  >
    <label class="label" :class="{ modif }">
      <span
        v-if="maxLength"
        class="max-length"
        :class="{
          visibleSoft: valueLength > 0,
          visibleHard: diff < maxLength / 4
        }"
        >{{ diff }}</span
      >
      <input
        ref="inp"
        v-focus="setFocus"
        class="input"
        :disabled="localDisabled"
        v-bind="{ ...defaultAttr, ...$attrs }"
        @keypress.enter="keyEnter"
        v-on="$listeners"
      />

      <icon-rounded-checker v-if="success" class="success_checker" />
      <button
        v-if="'disabled' in $attrs && $attrs.disabled && isAdmin"
        class="g-t-btn dis-btn"
        @click="disabled = typeof disabled === 'undefined' ? false : !disabled"
      >
        <icon-eye width="20" height="20" />
      </button>
      <span :class="{ placeholderFade }" class="placeholder"
        >{{ placeholder }}
      </span>
      <span v-if="hint" class="hint">{{ hint }}</span>
    </label>
    <span v-if="error && !noErrorText" class="error">{{ error }}</span>
  </fieldset>
</template>

<script lang="ts">
/* eslint-disable no-unused-expressions */
import Vue from 'vue'
import { mapGetters } from 'vuex'
const isTouch = () => (window as any).Modernizr.touchevents

export default Vue.extend({
  inheritAttrs: false,
  inject: ['isProd'],
  props: {
    /** Booleans */
    maxLength: Number,
    highlight: Boolean,
    setFocus: Boolean,
    noErrorText: Boolean,
    noBorder: Boolean,
    highlightError: Boolean,
    activatedIfFill: Boolean,
    placeholderFade: Boolean,
    gettingInput: {
      type: Function,
      default() {
        return () => {}
      }
    },
    hint: {
      type: String
    },
    error: {
      type: String
    },
    success: {
      type: Boolean
    },
    placeholder: {
      type: String,
      default: ''
    },
    postCreate: {
      type: Boolean
    }
  },
  data() {
    const vm = this
    return {
      isFocus: false,
      modif: false,
      disabled: undefined,
      defaultAttr: {
        type: 'text',
        autocomplete: 'off',
        inputmode: (() => {
          switch (vm.$attrs.type) {
            case 'search':
              return 'search'
            case 'number':
              return 'numeric'
            case 'email':
              return 'email'
          }
        })()
      }
    }
  },
  methods: {
    keyEnter() {
      // @ts-ignore
      if (isTouch()) this.$refs.inp?.blur()
    }
  },
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    diff(): number {
      return this.maxLength ? this.maxLength - this.valueLength : 0
    },
    valueLength(): number {
      return this.$attrs.value ? this.$attrs.value.length : 0
    },
    localDisabled() {
      const vm = this as any
      return vm.disabled ?? ('disabled' in vm.$attrs && vm.$attrs.disabled)
    }
  },
  created() {
    const vm = this
    if (vm.$attrs.value) vm.modif = true
  },
  mounted(): any {
    const vm = this
    vm.gettingInput(vm.$refs.inp)
    function inputCallback({ target }: any): void {
      vm.modif = !!target.value || target.value === 0
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
      vm.modif = !!value || value === 0
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
@import 'v-input';
</style>
