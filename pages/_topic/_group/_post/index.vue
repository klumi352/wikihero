<template>
  <div>
    <layout-3 no-min-height top-use>
      <template v-slot:default>
        <div class="top-wrap">
          <topic-breadcrumbs />
          <Post :post-data="post_page" :comment-count="comCount"></Post>
        </div>
      </template>
      <template v-slot:aside>
        <ChunkTagsList
          v-if="localNum < 3"
          use-in-aside
          :it="post_data.relative_posts_by_hashtags[0]"
        ></ChunkTagsList>
      </template>
    </layout-3>

    <layout-3 no-min-height nested-layout>
      <template v-slot:default>
        <div class="middle-wrap">
          <CommentList
            :page-id="post_page.id"
            post-page
            @watch="takeInfo"
            @create-success="createCommentHandler"
          ></CommentList>
        </div>
      </template>
      <template v-slot:aside>
        <ChunkTagsList
          v-if="localNum > 2"
          use-in-aside
          :it="post_data.relative_posts_by_hashtags[0]"
        ></ChunkTagsList>
      </template>
    </layout-3>

    <layout-3 no-min-height nested-layout last-one with-title>
      <template v-slot:title>
        <div class="bottom-wrap">
          <h3 class="g-h3">{{ $t('post-page.question-title') }}</h3>
        </div>
      </template>
      <template v-slot:default>
        <div class="bottom-wrap">
          <ChunkPostsList
            :it="post_data.relative_posts_by_category"
          ></ChunkPostsList>
          <div v-if="isHashtagExist" class="hidden-block">
            <h3 class="g-h3">{{ $t('post-page.hashtags-title') }}</h3>
            <div>
              <ChunkTagsList
                basic-view
                :it="post_data.relative_posts_by_hashtags[0]"
              ></ChunkTagsList>
            </div>
            <div>
              <ChunkTagsList
                basic-view
                :it="post_data.relative_posts_by_hashtags[1]"
              ></ChunkTagsList>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:aside>
        <ChunkTagsList
          use-in-aside
          :it="post_data.relative_posts_by_hashtags[1]"
        ></ChunkTagsList>
      </template>
    </layout-3>

    <flag-tip />
    <share-tip />
    <validating-tip />
    <CommentCreate />
    <!-- --- -->
  </div>
</template>

<style lang="scss" scoped>
@import 'index';
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable vue/no-unused-components */
/* eslint-disable prefer-const */
import Vue from 'vue'
import { mapState } from 'vuex'
import Post from '@/components/common/post-component-page/post-page.vue'
import CommentList from '@/components/common/comment-list-component/comment-list.vue'
import ChunkPostsList from '@/chunk/common/posts-small/posts-small.vue'
import ChunkTagsList from '@/chunk/common/tags-small/tags.vue'
import { Api } from '@/api.config'
import FlagTip from '@/components/topics/__modals/flag-tip/flag-tip.vue'
import ShareTip from '@/components/topics/__modals/share-tip/share-tip.vue'
import Comment from '@/components/common/comments-component/comments.vue'
import ValidatingTip from '@/components/topics/__modals/validating-tip/validating-tip.vue'
import TopicBreadcrumbs from '@/components/topics/topic-breadcrumbs/topic-breadcrumbs.vue'
import CommentCreate from '@/components/topics/__modals/comment-create/comment-create.vue'
import { headGenerator } from '@/helpers/headGenerator'
export default {
  components: {
    Post,
    CommentList,
    ChunkPostsList,
    ChunkTagsList,
    FlagTip,
    ShareTip,
    Comment,
    ValidatingTip,
    TopicBreadcrumbs,
    CommentCreate
  },
  async asyncData({ params, $axios, store, error, route }) {
    try {
      const data = await store.dispatch('post/SET_POST_PAGE', {
        post_slug: params.post
      })
      return {
        post_data: data
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  data() {
    return {
      localNum: null,
      comCount: 0
    }
  },
  computed: {
    ...mapState('post', ['post_page']),
    isHashtagExist() {
      return this.post_page.relative_posts_by_hashtags.length
    }
  },
  methods: {
    takeInfo(v: any) {
      this.localNum = v
    },
    createCommentHandler() {
      console.log('createCommentHandler')
      this.comCount++
      console.log(this.comCount)
    }
  },
  meta: {
    editable: true,
    createable: true,
    deleteable: true
  },
  head() {
    return headGenerator({
      name: this.post_page.title,
      description: this.post_page.preview_description,
      meta_description: this.post_page.meta_description,
      image: `${process.env.SITE_URL}/share-logo-large.png`,
      meta_keywords: this.post_page.meta_keywords
    })
  }
}
</script>
