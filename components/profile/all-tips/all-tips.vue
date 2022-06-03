<template>
  <section class="container">
    <div class="title g-h3">{{ $t('profile.group-title') }}</div>
    <div class="preloading" :class="[{ show: loadingTab }]">
      <img
        class="ico"
        width="60"
        height="60"
        src="~assets/svg/icon-preloader.svg"
        alt=""
      />
    </div>
    <div v-if="list.length" class="wrapper">
      <ul class="list">
        <SingleGroupItem
          v-for="item in list"
          :key="item.id"
          :it="item"
        ></SingleGroupItem>
      </ul>
      <v-pagination
        class="buttons"
        :meta="meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
    <div v-else class="not-found">
      <div v-if="loaded">
        <img :src="$t(`$i.profile-wait.url`)" width="300" alt="" />
        <h2>{{ $t(`profile.empty-tip-${currSort}`) }}</h2>
        <nuxt-link
          :to="$t(`profile.empty-tip-${currSort}-link`)"
          class="g-btn"
          >{{ $t(`profile.empty-tip-${currSort}-btn`) }}</nuxt-link
        >
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Vue from 'vue'
import SingleGroupItem from '@/chunk/common/group/group-item.vue'

export default Vue.extend({
  components: {
    SingleGroupItem
  },
  data() {
    return {
      loaded: false,
      currSort: 'top',
      loading: false,
      loadingTab: true,
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
    this.getData()
  },
  methods: {
    async getData({
      perPage = process.env.PROFILE_TIPS_PER_PARE,
      page = 1
    } = {}) {
      const data = await this.$axios.get(
        '/groups/subscribed-groups-for-profile',
        {
          params: {
            per_page: perPage,
            page
          }
        }
      )
      this.loaded = true
      this.loadingTab = false
      if (page > 1) {
        this.data.data.push(...data.data)
        this.data.meta = data.meta
      } else {
        this.data = data
      }
    },
    pagination({ page }) {
      this.loading = true
      this.getData({ page }).finally(() => {
        this.loading = false
      })
    },
    tabChange({ index }) {
      const vm = this
      vm.loadingTab = true
      ;(() => {
        switch (index) {
          case 0: {
            this.currSort = 'top'
            return this.getData()
          }
          case 1: {
            this.currSort = 'trend'
            return this.getData()
          }
          case 2: {
            this.currSort = 'alpha'
            return this.getData()
          }
          case 3: {
            this.currSort = 'new'
            return this.getData()
          }
          default: {
            return Promise.resolve()
          }
        }
      })().finally(() => {
        setTimeout(() => {
          this.loadingTab = false
        }, 400)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'all-tips';
</style>
