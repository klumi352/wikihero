<template>
  <div class="post-child">
    <ul class="a-df a-fww a-fdc">
      <li v-for="(post, index) in it" :key="index" class="post-child__item">
        <!--  -->
        <nuxt-link
          class="post-child__main-link a-df a-fdr a-aic"
          :to="post.computed_slug"
        >
          <div class="post-child__avatar">
            <div class="post-child__avatar--limit-wrap">
              <div class="post-child__avatar--wrap">
                <img
                  :src="post.author.image.original_url"
                  alt=""
                  class="post-child__avatar--img"
                />
              </div>
            </div>
          </div>
          <div class="post-child__title-wrap">
            <h3 class="g-h3 a-ffb">
              {{ post.title }}
            </h3>
          </div>
          <div class="post-child__post-info-wrap a-df a-aic">
            <div v-if="post.count_comments <= 0">
              <span class="post-child__new-mark a-ffr">{{
                $t('post.new')
              }}</span>
            </div>
            <div v-else class="a-df a-aic post-child__crumb-wrap">
              <IconMessage class="post-child__msg-icon" />
              <span class="a-ffr a-fz-14-16">{{ post.count_comments }}</span>
            </div>
          </div>
        </nuxt-link>
        <!--  -->
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import 'posts-small';
</style>

<script>
import IconMessage from '@/chunk/__svg/icon-message.svgm'

export default {
  components: {
    IconMessage
  },
  props: {
    it: Object
  },
  data() {
    return {
      posts: [
        {
          isNew: false
        },
        {
          isNew: true
        },
        {
          isNew: true
        },
        {
          isNew: false
        },
        {
          isNew: false
        }
      ]
    }
  }
}
</script>
