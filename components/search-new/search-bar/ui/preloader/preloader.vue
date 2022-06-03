<template>
  <div class="v-preloader" :class="{ visible }">
    <div class="wrapper">
      <img class="loading" src="~assets/svg/icon-preloader.svg" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      visible: false
    }
  },
  methods: {
    showPreloader() {
      return new Promise((resolve) => {
        this.visible = true
        setTimeout(resolve, 200)
      })
    },
    hidePreloader() {
      setTimeout(() => {
        this.visible = false
      }, 200)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'preloader';
</style>
