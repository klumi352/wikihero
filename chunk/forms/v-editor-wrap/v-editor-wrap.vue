<template>
  <div>
    <v-editor
      v-for="section in sections"
      ref="editor"
      :key="section.label"
      :data="section.data"
      :label="section.label"
    />
    <br />
    <fetch-loading :class="{ loading }"
      ><button :disabled="loading" class="g-btn g-btn--fill" @click="save">
        {{ $t('global.save') }}
      </button></fetch-loading
    >
    <button class="g-btn" @click="clear">Clear all</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Api } from '@/api.config'
export default Vue.extend({
  props: {
    sections: Object,
    pageId: Number
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    clear() {
      const vm = this as any
      if (!confirm(vm.$t('modal.are-you-sure'))) return
      ;(vm.$refs.editor as any).forEach((editor: any) => {
        editor.$emit('clear-all')
      })
    },
    async save() {
      const vm = this as any
      const content = {} as any
      vm.loading = true
      const promises = await Promise.all(
        (vm.$refs.editor as any).map((editor: any) => {
          return new Promise((resolve) => {
            editor.$emit('save')
            editor.$once('input', resolve)
          })
        })
      )
      Object.keys(vm.sections).forEach((key, index) => {
        content[key] = promises[index]
      })
      vm.$axios
        .put(Api.client.PAGE_EDIT(vm.pageId), {
          content
        })
        .then(() => {
          vm.loading = false
          vm.$notification.success('update')
        })
        .catch(() => {
          vm.loading = false
          vm.$notification.error('smth')
        })
    }
  }
})
</script>

<style lang="scss"></style>
