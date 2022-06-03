<template>
  <!-- eslint-disable vue/no-v-html -->
  <section class="g-container g-aside-container">
    <div class="wrapper">
      <div class="home-wrapper">
        <div
          v-once
          class="bg"
          :style="{
            backgroundImage: `url('${$t('$i.main-bg.url')}')`
          }"
        ></div>
        <div class="txt">
          <h1
            v-once
            ref="head"
            class="head"
            v-html="fintContentInEditor(data.title, 0)"
          ></h1>
          <div
            v-once
            class="descr"
            v-html="fintContentInEditor(data.description)"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { wrap } from '@/helpers'

export default Vue.extend({
  props: {
    data: Object
  },
  mounted() {
    if (!this.$refs.head) return
    ;(this.$refs.head as HTMLElement).querySelectorAll('b').forEach((b) => {
      wrap(b, document.createElement('span'))
    })
  }
})
</script>

<style lang="scss" scoped>
@import 'home-baner';
</style>
