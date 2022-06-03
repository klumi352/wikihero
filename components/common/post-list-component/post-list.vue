<template>
  <section class="post-list">
    <!-- Local preloader -->
    <div class="post-list__preloading" :class="[{ show: loadingTab }]">
      <img
        class="ico"
        width="60"
        height="60"
        src="~assets/svg/icon-preloader.svg"
        alt=""
      />
    </div>
    <!-- --- -->

    <!-- Title -->
    <div class="post-list__title g-h3">
      {{ $t('post.list-follow-title') }}
    </div>
    <!-- --- -->

    <!-- Sorting bar section -->
    <SortingBar @sort="catchSortType"></SortingBar>
    <!-- --- -->

    <!-- List post -->
    <div v-if="postList.length">
      <ul class="a-df a-fdc">
        <Post
          v-for="(post, index) in postList"
          :key="index"
          :post="post"
          force-open
          class="post-list__item"
        ></Post>
      </ul>
      <div class="a-df a-jcc">
        <v-pagination
          class="buttons"
          :meta="postMeta"
          :loading="loading"
          @change="pagination"
        />
      </div>
    </div>
    <!-- --- -->

    <!-- No found section -->
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
    <!-- --- -->
  </section>
</template>

<style lang="scss" scoped>
@import 'post-list.scss';
</style>

<script>
/* eslint-disable no-useless-catch */
/* eslint-disable prefer-const */
import Post from '@/components/common/post-component/post-item.vue'
import SortingBar from '@/chunk/common/sorting-bar/sorting-bar.vue'
import { Api } from '@/api.config'
export default {
  components: {
    Post,
    SortingBar
  },
  data() {
    return {
      postList: [],
      loadingTab: true,
      currSort: 'top',
      loaded: false,
      postMeta: {},
      loading: false
    }
  },
  async created() {
    if (process.server) return
    await this.getPostList({ page: 1 })
  },
  methods: {
    async getPostList({ page, order_by } = { page: 1, order_by: 'recent' }) {
      try {
        const params = {
          per_page: process.env.PROFILE_POST_PER_PAGE,
          page,
          order_by
        }
        let { data, meta } = await this.$axios.get(Api.new.PROFILE_POST_LIST, {
          params
        })
        data = data.map((post) => ({
          ...post,
          currentStep: 0,
          showPreview: true
        }))
        this.loaded = true
        this.loadingTab = false
        if (page > 1) {
          this.postList.push(...data)
          this.postMeta = meta
        } else {
          this.postList = data
          this.postMeta = meta
        }
      } catch (e) {
        throw e
      }
    },
    async catchSortType(e) {
      this.$root.$showPreloader()
      await this.getPostList({ page: 1, order_by: e }).finally(() => {
        setTimeout(() => {
          this.$root.$hidePreloader()
        }, 150)
      })
    },
    async pagination({ page }) {
      this.loading = true
      await this.getPostList({ page }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
