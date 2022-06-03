<template>
  <div class="comment-container">
    <comment-list
      :title="$t('comment.profile-list-title')"
      :pagination="commentsData"
      profile-use
      :is-loading="loading"
      :is-loaded="loaded"
      :is-loading-tab="loadingTab"
      @sort="catchSortType"
      @change="handleCommentsPaginate"
    >
    </comment-list>
  </div>
</template>

<script>
import CommentList from '@/components/comments/comment-list.vue'
import { Api } from '@/api.config'
export default {
  components: {
    CommentList
  },
  data() {
    return {
      commentsData: {},
      loading: false,
      loadingTab: true,
      loaded: false
    }
  },
  async created() {
    if (process.server) return
    await this.fetchCommentList({ page: 1 })
  },
  methods: {
    async fetchCommentList(
      { page = 1, order_by } = {
        page: 1,
        order_by: 'recent'
      }
    ) {
      const params = {
        page,
        order_by,
        per_page: process.env.PROFILE_COMMENT_PER_PAGE
      }
      const comments = await this.$axios.get(Api.new.PROFILE_COMMENT_LIST, {
        params
      })
      this.loaded = true
      this.loadingTab = false
      if (page > 1) {
        this.commentsData.data.push(...comments.data)
        this.commentsData.links = comments.links
        this.commentsData.meta = comments.meta
      } else {
        this.commentsData = comments
      }
    },
    async catchSortType(e) {
      this.$root.$showPreloader()
      await this.fetchCommentList({ page: 1, order_by: e }).finally(() => {
        setTimeout(() => {
          this.$root.$hidePreloader()
        }, 150)
      })
    },
    async handleCommentsPaginate({ page }) {
      this.loading = true
      await this.fetchCommentList({ page }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
