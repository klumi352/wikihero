<template>
  <div>
    <h1>Terms</h1>
    <br />
    <v-editor-wrap :page-id="pageId" :sections="sections" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Api } from '@/api.config'
export const PAGE_SLUG = 'terms'

export default Vue.extend({
  async asyncData({ $axios }) {
    const sections: any = {
      title: {
        label: 'title',
        data: null
      },
      description: {
        label: 'description',
        data: null
      },
      items: {
        label: 'items',
        data: null
      }
    }
    const { data }: any = await $axios.get(Api.client.PAGE(PAGE_SLUG))
    Object.keys(sections).forEach((key) => {
      sections[key].data = data.content[key] || {}
    })
    return {
      sections,
      pageSlug: PAGE_SLUG,
      pageId: data.id
    }
  }
})
</script>

<style lang="scss"></style>
