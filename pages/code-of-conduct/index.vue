<template>
  <div>
    <layout-1>
      <template v-slot:default>
        <v-baner>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <h1>{{ _fintContentInEditor(content.title, 0) }}</h1>
          <template slot="intro">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="_fintContentInEditor(content.description)"></div>
          </template>
        </v-baner>
        <v-collapse json="privacy" :data="content.items" />
      </template>
    </layout-1>
  </div>
</template>

<script lang="ts">
import { Api } from '@/api.config'
import { headGenerator } from '@/helpers/headGenerator'
import { EditorMixins } from '@/plugins/vue-extend/mixins/-editor-minins'
import { PAGE_SLUG } from '@/pages/admin/pages/code-of-conduct.vue'

export default EditorMixins().extend({
  async asyncData({ $axios }) {
    try {
      const { data }: any = await $axios.get(Api.client.PAGE(PAGE_SLUG))
      return {
        content: data?.content || {}
      }
    } catch (e) {
      return {
        content: {}
      }
    }
  },
  head() {
    return headGenerator({
      name: this.$t('footer.code-of-conduct')
    })
  }
})
</script>

<style lang="scss"></style>
