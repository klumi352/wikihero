import Vue from 'vue'
import tippy, { roundArrow } from 'tippy.js'
import 'tippy.js/dist/svg-arrow.css'

Vue.directive('tip', {
  inserted(el, binding) {
    el.tippyInstance = tippy(el, {
      content: binding.value,
      animation: 'fade',
      arrow: roundArrow,
      delay: [null, 0],
      theme: 'main'
    })
  },
  unbind(el) {
    el.tippyInstance.destroy()
  }
})
