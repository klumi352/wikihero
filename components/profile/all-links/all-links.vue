<template>
  <section class="container">
    <div class="wrapper">
      <h3 class="head">{{ $t('profile.link-head') }}</h3>
      <div class="list-wrap">
        <ul v-if="list.length" class="list">
          <v-link-resource v-for="r in data.data" :key="r.id" :it="r" />
        </ul>
        <div v-else class="not-found">
          <div v-if="loaded">
            <img :src="$t(`$i.profile-wait.url`)" width="300" alt="" />
            <h2>{{ $t(`profile.empty-link`) }}</h2>
            <nuxt-link :to="$t(`profile.empty-link-link`)" class="g-btn">{{
              $t(`profile.empty-link-btn`)
            }}</nuxt-link>
          </div>
        </div>
        <div class="preloading" :class="[{ show: loadingTab }]">
          <img
            class="ico"
            width="60"
            height="60"
            src="~assets/svg/icon-preloader.svg"
            alt=""
          />
        </div>
      </div>
      <v-pagination
        class="buttons"
        :meta="data.meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { Api } from '@/api.config'

export default Vue.extend({
  data() {
    return {
      loaded: false,
      loading: false,
      loadingTab: false,
      data: {}
    }
  },
  computed: {
    list() {
      return this.data.data || []
    },
    meta() {
      return this.data.meta || null
    }
  },
  created() {
    if (process.server) return

    this.loadingTab = true
    this.getData()
  },
  methods: {
    async getData({
      perPage = process.env.PROFILE_LINK_PER_PARE,
      page = 1
    } = {}) {
      try {
        this.loadingTab = true
        const data = await this.$axios.get(Api.client.LINK_PROFILE_ALL, {
          params: {
            perPage,
            page
          }
        })
        this.loaded = true
        if (page > 1) {
          this.data.data.push(...data.data)
          this.data.meta = data.meta
        } else {
          this.data = data
        }
      } finally {
        setTimeout(() => {
          this.loadingTab = false
        }, 400)
      }
    },
    pagination({ page }) {
      this.loading = true
      this.getData({ page }).finally(() => {
        this.loading = false
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'all-links';
</style>
