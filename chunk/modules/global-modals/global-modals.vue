<template>
  <div>
    <!-- WARN The component must have name -->
    <contribute-tip ref="contributeModal" name="contribute-modal" />
    <ask-question ref="askQuestion" name="ask-question" />
    <CreatePost ref="createPost" name="create-post" />
    <Preloader ref="searchPreloader" name="search-preloader"></Preloader>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ContributeTip from '@/components/topics/__modals/contribute-tip/contribute-tip.vue'
import AskQuestion from '@/components/topics/__modals/ask-question/ask-question.vue'
import CreatePost from '@/components/topics/__modals/post-create/post-create.vue'
import Preloader from '@/components/search-new/search-bar/ui/preloader/preloader.vue'

export default Vue.extend({
  components: {
    ContributeTip,
    AskQuestion,
    CreatePost,
    Preloader
  },
  created() {
    if (process.browser) {
      this.$root.globalModals = this.$refs
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'global-modals';
</style>
