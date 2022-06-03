<template>
  <div
    v-if="it && it.posts.length"
    class="tags"
    :class="{ basic: basicView, useInAside }"
  >
    <div class="tags__wrap">
      <div class="tags__title-wrap a-df">
        <span class="a-ffr a-fz-12-15">{{ it.title }}</span>
      </div>
      <ul class="tags__list">
        <li v-for="(tag, index) in it.posts" :key="index" class="tags__item">
          <!--  -->
          <nuxt-link class="tags__main-link a-df a-fdc" :to="tag.computed_slug">
            <h3 class="tags__post-name a-ffr a-fz-12-15">
              {{ tag.title }}
            </h3>
            <div class="tags__post-info-wrap a-df a-aic">
              <div v-if="tag.count_comments <= 0">
                <span class="tags__new-mark a-ffr">{{
                  $t('hashtag.new')
                }}</span>
              </div>
              <div v-else class="a-df a-aic">
                <div v-if="basicView" class="a-df a-aic">
                  <IconMessage class="tags__msg-icon" />
                  <span class="a-ffr tags__crumb-txt">{{
                    tag.count_comments
                  }}</span>
                </div>
                <span v-else class="a-ffr a-fz-14-16 tags__crumb-txt">
                  {{
                    tag.count_comments
                      | pluralize(
                        $t('comment.comments-postfix-singular'),
                        $t('comment.comments-postfix-plural')
                      )
                  }}</span
                >
              </div>
            </div>
          </nuxt-link>
          <!--  -->
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'tags';
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    basicView: Boolean,
    useInAside: Boolean,
    it: Object
  }
})
</script>
