<template>
  <div class="comments-list">
    <CommentTypeSelect
      v-if="checkCommentsLength"
      @comment-sorting="
        (v) => {
          main_comment_type = v
          getMainComments({ post_id: Number(pageId) })
        }
      "
    ></CommentTypeSelect>
    <!-- Comment list -->
    <ul v-if="checkCommentsLength" class="comments-list__list">
      <Comment
        v-for="comment in main_comments_list"
        :key="comment.id"
        nested-comments
        main-comments
        :it="comment"
        :post-id="pageId"
        :post-author-id="postAuthorId"
        @create-success="onSuccessHandle"
        @expand="showThread"
      >
        <Comment
          v-for="nestComment in comment.replies"
          :key="nestComment.id"
          :it="nestComment"
          :main-comment-id="comment.id"
          :post-author-id="postAuthorId"
          :post-id="pageId"
          @create-success="onSuccessHandle"
        ></Comment>
        <template v-slot:pagination>
          <v-pagination
            v-if="
              !checkReplyMeta(comment) &&
                !main_comments_id.some((i) => i === comment.id)
            "
            class="buttons"
            :meta="comment.reply_meta"
            :loading="false"
            @change="paginationReply($event, comment.id)"
          />
          <div
            v-if="
              !checkReplyMeta(comment) &&
                !main_comments_id.some((i) => i === comment.id)
            "
          >
            <ul>
              <Comment
                v-for="preview in comment.preview_collection"
                :key="`subcomment-${preview.id}`"
                :it="preview"
                :main-comment-id="comment.id"
                :post-author-id="postAuthorId"
                :post-id="pageId"
              ></Comment>
            </ul>
          </div>
        </template>
      </Comment>
    </ul>
    <v-pagination
      v-show="!checkMainMeta"
      class="buttons"
      :meta="main_comments_meta"
      :loading="false"
      @change="paginationMain($event, pageId)"
    />
    <!--  -->
    <div v-if="!postPage" class="comments-list__separator">
      <span class="comments-list__separator--deco-line"></span>
      <span class="comments-list__separator--deco-txt a-ffr">{{
        $t('comment.whats-more-separator')
      }}</span>
      <span class="comments-list__separator--deco-line"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'comment-list';
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable vue/no-unused-components */
import { mapState, mapGetters } from 'vuex'
import Comment from '@/components/common/comments-component/comments.vue'
import CommentTypeSelect from '@/chunk/forms/v-comment-select/v-comment-select.vue'
import { CommentMixin } from '~/plugins/vue-extend/mixins/-comment-mixin'

export default CommentMixin().extend({
  components: {
    Comment,
    CommentTypeSelect
  },
  props: {
    pageId: Number,
    postPage: Boolean,
    postAuthorId: Number
  },
  data() {
    return {
      decoTxt: 'See more What’s new '
    }
  },
  async created() {
    const vm = this as any
    await vm.getMainComments({ post_id: Number(vm.pageId) })
    vm.connectSocket(Number(vm.pageId))
  },
  watch: {
    main_comments_list: {
      deep: true,
      handler(n) {
        this.$emit('watch', n?.length)
      }
    }
  },
  methods: {
    onSuccessHandle() {
      this.$emit('create-success')
    }
  },
  destroyed() {
    const vm = this as any
    vm.destroySocket(Number(vm.pageId))
  }
})
</script>
