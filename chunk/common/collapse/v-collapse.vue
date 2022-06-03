<template>
  <section class="container">
    <!-- !!! -->
    <!-- !!! -->
    <!-- IMPORTANT -->
    <!-- works only with API /pages -->
    <!-- eslint-disable vue/no-v-html -->
    <div class="g-h3 a-mt-40-80 a-mb-20"></div>
    <ul class="list">
      <li
        v-for="(item, index) in _chunkData(data)"
        :id="slugify(_fintContentInEditor(item, 0))"
        :key="index"
        class="item"
        :class="{ active: active === index }"
      >
        <div v-once class="title g-h2" @click="handleClick(index)">
          {{ _fintContentInEditor(item, 0) }}
          <icon-arrow class="arrow" />
        </div>
        <div v-once ref="intro" class="descr">
          <span
            ref="descr"
            class="g-cms"
            v-html="_fintContentInEditor(_trimFirstBlock(item))"
          ></span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { slugify } from '@/helpers/slugify'
import sizes from '@/helpers/dom/sizes'
import { EditorMixins } from '@/plugins/vue-extend/mixins/-editor-minins'

export default EditorMixins().extend({
  props: {
    data: Object
  },
  data() {
    return {
      active: null
    }
  },
  mounted() {
    let hash = this.$route.hash
    if (hash) {
      hash = hash.slice(1)
      /** TODO scroll to scroll */
    }
  },
  watch: {
    active(curr, prev) {
      const vm = this as any
      if (typeof curr === 'number') {
        vm.$refs.intro[curr].style.height = `${sizes.getAbsHeight(
          vm.$refs.descr[curr]
        )}px`
      }
      if (typeof prev === 'number') {
        vm.$refs.intro[prev].style.height = '0px'
      }
    }
  },
  methods: {
    slugify,
    handleClick(index: any) {
      if (this.active === index) {
        this.active = null
      } else {
        this.active = index
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-collapse';
</style>
