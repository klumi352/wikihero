<template>
  <div>
    <home-baner :data="{ title: page.title, description: page.description }" />
    <home-power :data="page.power" />
    <home-hero :data="listData" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { headGenerator } from '@/helpers/headGenerator'
import { PAGE_SLUG } from '@/pages/admin/pages/home.vue'
import HomeBaner from '@/components/home/home-baner/home-baner.vue'
import HomePower from '@/components/home/home-power/home-power.vue'
import HomeHero from '@/components/home/home-hero/home-hero.vue'

export default Vue.extend({
  name: 'HomePage',
  components: {
    HomeBaner,
    HomePower,
    HomeHero
  },
  async asyncData({ $axios, store }: Context) {
    try {
      const [pageContent] = await Promise.all([
        $axios.get(Api.client.PAGE(PAGE_SLUG)),
        store.dispatch('contributors/GET_CONTRIBUTORS_DATA')
      ])
      return {
        page: pageContent.data?.content || {}
      }
    } catch (e) {
      return {
        page: {}
      }
    }
  },
  computed: {
    ...mapState('contributors', ['listData'])
  },
  mounted() {
    if (process.env.MODE !== 'production') {
      this.$analytic.trackers.test.st1()
      setTimeout(() => {
        this.$analytic.trackers.test.st2()
      }, 1000)
      setTimeout(() => {
        this.$analytic.trackers.test.st3()
      }, 2000)
    }
  },
  meta: {
    editable: true
  },
  globalObserver() {
    return {
      collection: () => this.$el.children
    }
  },
  head() {
    return headGenerator({
      name: this.$t('meta.home-title'),
      description: this.$t('meta.home-description')
    })
  }
})
</script>

<style lang="scss"></style>
