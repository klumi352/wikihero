<template>
  <div class="v-editor">
    <h2 v-if="label" class="g-nice-text">{{ $t(`editor.${label}`) }}</h2>
    <div :id="`editorjs${id}`"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { random } from '@/helpers'
const EditorJS = process.client && require('@editorjs/editorjs')

export default Vue.extend({
  props: {
    data: Object,
    label: String
  },
  data() {
    return {
      loading: false,
      id: null as any
    }
  },
  async mounted() {
    const vm = this
    vm.id = random()
    await vm.$nextTick()
    const editor = new EditorJS({
      /**
       * Id of Element that should contain Editor instance
       */
      holderId: `editorjs${vm.id}`,
      tools: {
        header: require('@editorjs/header'),
        list: require('@editorjs/list')
      },
      placeholder: (vm as any).$t('editor.placeholder'),
      autofocus: true,
      data: vm.data
    })

    await editor.isReady

    vm.$on('save', () => {
      editor
        .save()
        .then((outputData: any) => {
          // eslint-disable-next-line no-console
          vm.$emit('input', outputData)
        })
        .catch((error: any) => {
          // eslint-disable-next-line no-console
          console.error('Saving failed: ', error)
        })
    })

    vm.$on('clear-all', () => {
      editor.clear()
    })

    vm.$once('hook:beforeDestroy', () => {
      editor.destroy()
    })
  }
})
</script>

<style lang="scss" scoped>
@import 'v-editor';
</style>
