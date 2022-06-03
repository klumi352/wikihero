import Vue from 'vue'

Vue.directive('focus', {
  inserted(el, binding) {
    if (binding.value && el.focus) {
      el.focus()
    }
  }
})
