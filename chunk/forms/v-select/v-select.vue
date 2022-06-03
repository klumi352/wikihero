<template>
  <!-- eslint-disable vue/no-v-html -->
  <fieldset
    ref="wrapper"
    :class="{ 'with-error': error, success: success && !error }"
    class="input-wrapper"
  >
    <label class="label" :class="{ modif }">
      <vue-select
        :placeholder="placeholder"
        class="input"
        v-bind="{ ...$attrs }"
        v-on="{ ...$listeners }"
      >
        <template v-slot:option="option">
          <span class="item">{{
            $attrs.label ? option[$attrs.label] : option.label
          }}</span>
        </template>

        <template v-slot:no-options="{ search, searching }">
          <span
            v-if="searching"
            v-html="
              $t('form.empty-select-typing', {
                data: search
              })
            "
          ></span>
          <span
            v-else
            v-html="
              $t('form.empty-select', {
                data: search
              })
            "
          ></span>
        </template>
      </vue-select>
    </label>
    <span v-if="error" class="error">{{ error }}</span>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
import sizes from '@/helpers/dom/sizes'

export default Vue.extend({
  inheritAttrs: false,
  props: {
    gettingInput: {
      type: Function,
      default() {
        return () => {}
      }
    },
    hint: String,
    error: String,
    success: Boolean,
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      modif: false
    }
  },
  created() {
    const vm = this
    if (vm.$attrs.value) vm.modif = true
  },
  mounted(): any {
    const vm = this
    vm.gettingInput(vm.$refs.inp)
    ;(vm.$refs.wrapper as HTMLElement).style.maxWidth = `${
      sizes.getWidth(vm.$refs.wrapper).client
    }px`

    vm.$watch('$attrs.value', (value) => {
      vm.modif = !!value
    })
  }
})
</script>

<style lang="scss" scoped>
@import 'v-select';
</style>
