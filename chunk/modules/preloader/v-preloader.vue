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
  watch: {
    $route() {
      this.$root.$hidePreloader()
    }
  },
  created() {
    if (process.server) return

    this.$root.$showPreloader = () =>
      new Promise((resolve) => {
        this.visible = true
        setTimeout(resolve, 200)
      })

    this.$root.$hidePreloader = () => {
      setTimeout(() => {
        this.visible = false
      }, 200)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-preloader';
</style>
