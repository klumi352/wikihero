<template>
  <li class="topic" :class="{ noParent: !topic.parent }">
    <nuxt-link class="topic-main-link" :to="topic.computed_slug">
      <span class="topic-title g-h2">{{ topic.name }}</span>
    </nuxt-link>
    <div class="topic-bot-wrapper">
      <span v-if="topic.parent" class="topic-link-prefix">{{
        $t('feed.link-prefix')
      }}</span>
      <nuxt-link
        v-if="topic.parent"
        class="topic-secondary-link"
        :to="topic.parent.computed_slug"
      >
        {{ topic.parent.name }}
      </nuxt-link>
      <span class="topic-answers">{{
        topic.tips_count
          | pluralize($t('feed.question-end'), $t('feed.question-end-pl'), true)
      }}</span>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import 'topic';
</style>

<script>
export default {
  props: {
    topic: {
      type: Object,
      required: true
    }
  }
}
</script>
