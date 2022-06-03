<template>
  <transition :name="transitionDir">
    <div v-if="isShow" class="step">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    /** For ssr visible */
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      transitionDir: null,
      isShow: this.visible
    }
  },
  methods: {
    hide() {
      this.isShow = false
    },
    show() {
      this.isShow = true
    }
  }
})
</script>

<style lang="scss" scoped>
.step {
  border: 1px solid $t;
  padding: 1px 0;
}
</style>
