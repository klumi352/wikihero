<template>
  <div ref="tab" class="home-tab" :class="{ active: index === activeTab }">
    <div class="home-tab-wrap a-cgreyligth-1">
      <h3 class="a-m0 home-tab-title" @click="open">
        {{ _fintContentInEditor(item, 0) }}
      </h3>
      <div class="home-tab-expand" :style="{ height }">
        <div ref="expand">
          <p class="a-cblack a-mb-0 a-fz-18-20 home-tab-desc">
            {{ _fintContentInEditor(item, 1) }}
          </p>
          <div class="home-tab-btn">
            <slot v-if="index === 0" name="first" />
            <slot v-if="index === 1" name="second" />
            <slot v-if="index === 2" name="third" />
            <slot v-if="index === 3" name="fourth" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EditorMixins } from '@/plugins/vue-extend/mixins/-editor-minins'

export default EditorMixins().extend({
  props: {
    item: Object,
    activeTab: Number,
    index: Number
  },
  data: () => ({
    height: 0,
    content: null
  }),
  methods: {
    open() {
      this.content = this.$refs.expand.offsetHeight + 5
      if (!this.height) {
        this.height = `${this.content}px`
        setTimeout(() => (this.height = 'auto'), 350)
        this.$emit('close-all', this.index)
      }
    },
    close() {
      if (this.height) {
        this.height = `${this.content}px`
        setTimeout(() => (this.height = 0), 50)
      }
    }
  },
  watch: {
    activeTab(val) {
      if (val !== this.index) this.close()
    }
  },
  mounted() {
    if (this.index === this.activeTab) this.open()
  }
})
</script>

<style lang="scss" scoped>
@import 'tab';
</style>
