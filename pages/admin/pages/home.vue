<template>
  <div>
    <h1>Home</h1>
    <br />
    <v-editor-wrap :page-id="pageId" :sections="sections" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import { Api } from '@/api.config'
export const PAGE_SLUG = 'home'

export default Vue.extend({
  async asyncData({ $axios }: Context) {
    const sections: any = {
      title: {
        label: 'title',
        data: null
      },
      description: {
        label: 'description',
        data: null
      },
      power: {
        label: 'power',
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
