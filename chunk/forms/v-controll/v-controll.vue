<template>
  <fieldset
    :class="[{ 'with-error': error }, `with-${type}`]"
    class="input-wrapper"
  >
    <label class="label" :class="[{ modif }]">
      <input
        ref="inp"
        class="input"
        v-bind="{ type, ...$attrs }"
        v-on="$listeners"
      />
      <span class="controll">
        <icon-correct width="18" height="18" class="ico ico--correct" />
        <span class="ico ico--radio" />
      </span>
      <span v-if="hint" class="hint g-h3">
        {{ hint }}
        <slot name="hintDesc" />
      </span>
      <slot />
    </label>
    <span class="error">{{ error }}</span>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  inheritAttrs: false,
  props: {
    gettingInput: {
      type: Function,
      default() {
        return () => {}
      }
    },
    type: {
      type: String,
      validator(v) {
        return ['checkbox', 'radio'].includes(v)
      }
    },
    hint: {
      type: String
    },
    error: {
      type: String
    }
  },
  data() {
    return {
      isFocus: false,
      modif: false
    }
  },
  mounted(): any {
    const vm = this
    vm.gettingInput(vm.$refs.inp)
    function inputCallback({ target }: any): void {
      vm.modif = !!target.value
    }

    inputCallback({ target: vm.$refs.inp })
    ;(vm.$refs.inp as HTMLElement).addEventListener('input', inputCallback)
    vm.$once('hook:beforeDestroy', () => {
      ;(vm.$refs.inp as HTMLElement).removeEventListener('input', inputCallback)
    })
  }
})
</script>

<style lang="scss" scoped>
@import 'v-controll';
</style>
