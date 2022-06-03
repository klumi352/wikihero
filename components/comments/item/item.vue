<template>
  <li class="post-class">
    <div class="post">
      <div class="post__wrap">
        <div class="post__top-wrap">
          <div class="post__avatar-wrap">
            <img
              :src="postOwnerAvatarUrl"
              :alt="postOwnerName"
              class="post__avatar"
            />
          </div>
          <nuxt-link
            :to="commentLink"
            class="post__title a-ffb highlight-wrap"
            v-html="processedTitle"
          />
          <div class="post__nav-wrap">
            <ul>
              <PostLinkBreadcrumbs
                is-group
                :prop-data="groupTitle"
                :prop-url="groupUrl"
              ></PostLinkBreadcrumbs>
              <PostLinkBreadcrumbs
                is-category
                :prop-data="categoryTitle"
                :prop-url="`/search?category_id=${categoryId}`"
              ></PostLinkBreadcrumbs>
              <PostLinkBreadcrumbs
                v-for="(hashtag, index) in processedHashtags"
                :key="index"
                :prop-data="hashtag.name"
                :prop-url="`/search?hashtag_id=${hashtag.id}`"
              ></PostLinkBreadcrumbs>
            </ul>
          </div>
        </div>
        <div class="post__content-wrap">
          <div class="post__overflow-wrap">
            <div
              class="post__preview-txt a-fz-18-20 highlight-wrap"
              v-html="processedDescription"
            ></div>
          </div>
          <div class="post__author">
            <div class="media">
              <img :src="authorAvatarUrl" alt="avatar" />
            </div>
            <div class="txt">
              {{ authorPostJobTitle }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import PostLinkBreadcrumbs from '@/chunk/common/post-links-breadcrumbs/post-links-breadcrumbs.vue'
import { SearchResultItemMixin } from '~/plugins/vue-extend/mixins/-search-result-item-mixin'

export default SearchResultItemMixin().extend({
  components: {
    PostLinkBreadcrumbs
  },
  props: {
    item: Object
  },
  computed: {
    processedHashtags() {
      return this.item.post?.hashtags
    },
    authorName() {
      return this.item.author_name
    },
    authorAvatarUrl() {
      return this.item.author_avatar?.original_url
    },
    postOwnerAvatarUrl() {
      return this.item.post?.author?.image?.original_url
    },
    postOwnerName() {
      return this.item.post?.name
    },
    authorPostAvatarUrl() {
      return this.item.post?.author?.image?.original_url
    },
    commentLink() {
      return this.item.post?.computed_slug || ''
    },
    groupTitle() {
      return this.item.post?.group?.title || ''
    },
    authorPostJobTitle() {
      return (
        `${
          this.item.author_name === null ? '' : this.item.author_name + ' · '
        }${
          this.item.author_job_title === null ? '' : this.item.author_job_title
        }${
          this.item.created_at === null ? '' : ' · ' + this.item.created_at
        }` || ''
      )
    },
    groupUrl() {
      return `/${this.item.post?.topic?.slug}/${this.item.post?.group?.slug}`
    },
    categoryTitle() {
      return this.item.post?.category?.title ?? ''
    },
    categoryId() {
      return this.item.post?.category?.id ?? null
    },
    processedTitle() {
      return this.item.post?.title
    },
    processedDescription() {
      return this.item.body
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'item';
</style>
