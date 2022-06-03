<template>
  <fieldset class="input-wrapper">
    <v-input
      ref="el"
      :getting-input="setFromValidation"
      type="password"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <ul v-if="tempValue" class="errors">
      <li
        v-for="(val, key, index) in validations"
        :key="index"
        :class="{ active: val.state }"
        class="error"
      >
        <span>{{ key }}</span>
      </li>
    </ul>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  inheritAttrs: false,
  data() {
    const vm = this as any
    return {
      tempValue: '',
      validations: {
        [vm.$t('form.count-pass-validate')]: {
          test: (t: any) => t.length > 7,
          state: false
        },
        [vm.$t('form.capital-pass-validate')]: {
          test: (t: any) => /[A-Z]/.test(t),
          state: false
        },
        [vm.$t('form.number-pass-validate')]: {
          test: (t: any) => /\d/.test(t),
          state: false
        }
      } as any
    }
  },
  methods: {
    setFromValidation(el: any) {
      const vm = this
      function inputCallback({ target }: any): void {
        const value: string = target.value
        vm.tempValue = value
        Object.values(vm.validations).forEach((option: any) => {
          option.state = option.test(value)
        })
      }

      inputCallback({ target: el })
      ;(el as HTMLElement).addEventListener('input', inputCallback)
      vm.$once('hook:beforeDestroy', () => {
        ;(el as HTMLElement).removeEventListener('input', inputCallback)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-password';
</style>
