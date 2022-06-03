/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Api } from '@/api.config'

type IdType = {
  id: number
}

export const CommentMixin = () =>
  Vue.extend({
    props: {
      post: Object
    },
    data() {
      return {
        main_comments_list: [],
        main_comments_id: [],
        main_comments_meta: {},
        // reply_comments_id: {}
        main_comment_type: 'old-comment'
      }
    },
    computed: {
      checkMainMeta() {
        const vm = this as any
        return (
          vm.main_comments_meta.current_page === vm.main_comments_meta.last_page
        )
      },
      ...mapGetters('auth', ['loggedIn']),
      checkCommentsLength() {
        const vm = this as any
        return vm.main_comments_list?.length
      }
    },
    methods: {
      /**
       * Methods - Main comments
       */
      setCommentsList(value: Array<object>) {
        const vm = this as any
        if (value.length) {
          const main_comments = value.map((comment) => ({
            ...comment,
            expanded: false,
            reply_meta: {}
          }))
          vm.main_comments_list = main_comments
        }
      },
      pushCommentsList(value: Array<object>) {
        const vm = this as any
        if (value.length) {
          const main_comments = value.map((comment) => ({
            ...comment,
            expanded: false,
            reply_meta: {}
          }))
          vm.main_comments_list.push(...main_comments)
        }
      },
      setCommentsMeta(value: object) {
        const vm = this as any
        vm.main_comments_meta = value
      },
      toggleExpanded(id: IdType) {
        const vm = this as any
        if (vm.main_comments_list.length) {
          const current = vm.main_comments_list.find(
            (comment: any) => comment.id === id
          )
          if (current) {
            current.expanded = true
          }
        }
      },
      unshiftMainComment(value: object) {
        const vm = this as any
        if (vm.loggedIn) {
          const isLastPage: boolean =
            vm.main_comments_meta.current_page ===
            vm.main_comments_meta.last_page
          switch (vm.main_comment_type) {
            case 'old-comment':
            case 'popular':
              if (isLastPage) vm.main_comments_list.push(value)
              break
            case 'new-comment':
              vm.main_comments_list.unshift(value)
              break
          }
        }
      },
      pushMainId(id: IdType) {
        const vm = this as any
        vm.main_comments_id.push(id)
      },
      /**
       * Methods - Reply comments
       */
      pushReplyComments(value: Array<object> | any, id: IdType) {
        const vm = this as any
        if (vm.main_comments_list.length) {
          const current = vm.main_comments_list.find(
            (comment: any) => comment.id === id
          )
          if (current) {
            current.replies.push(...value.data)
            current.reply_meta = value.meta
          }
        }
      },
      // setReplyId(main_id: IdType | any, reply_id: IdType) {
      //   const vm = this as any
      //   if (vm.reply_comments_id[main_id]) {
      //     vm.reply_comments_id[main_id].push(reply_id)
      //   } else {
      //     vm.$set(this.reply_comments_id, main_id, [reply_id])
      //   }
      // },
      unshiftReplyComments(value: any, id: IdType) {
        const vm = this as any
        if (vm.main_comments_list.length) {
          const current = vm.main_comments_list.find(
            (comment: any) => comment.id === id
          )
          console.log('MAIN_COMMENT_LIST', current)
          if (current) {
            const isLastPage =
              current.reply_to_comment?.current_page ===
              current.reply_to_comment?.last_page
            if (isLastPage) current.replies.push(value)
          }
        }
      },
      checkReplyMeta(i: object | any) {
        return i?.reply_meta?.current_page === i?.reply_meta?.last_page
      },
      setInitialReplies() {
        const vm = this as any
        if (vm.main_comments_list.length) {
          vm.main_comments_list.forEach((comment: any) => {
            const exist = vm.main_comments_id.some(
              (item: any) => item?.id === comment.id
            )
            if (!exist && comment?.replies?.length >= 4) {
              comment.replies = []
              comment.expanded = false
              comment.reply_meta = {}
            }
          })
        }
      },
      /**
       * Methods - request
       */
      async getMainComments({ page = 1, post_id, per_page = 50 }: any) {
        const vm = this as any
        const paramsObj = {
          params: {
            page,
            per_page,
            ignore: vm.main_comments_id || [],
            order_by: vm.main_comment_type
          }
        }
        const { data, meta } = await vm.$axios.get(
          Api.new.GET_COMMENTS_LIST_BY_ID(post_id),
          paramsObj
        )
        if (page < 2) vm.setCommentsList(data)
        else vm.pushCommentsList(data)
        vm.setCommentsMeta(meta)
      },
      async getReplyComments({ page = 1, parent_id, per_page = 50 }: any) {
        const vm = this as any
        /**
         * Map main comments and set replies array to initial state
         * After that get replies for current main comment
         */
        if (page < 2) vm.setInitialReplies()
        /** */
        const paramsObj = {
          params: {
            page,
            per_page
            // 'ignore[]': vm.reply_comments_id[parent_id] || []
          }
        }
        try {
          const reply_list = await vm.$axios.get(
            Api.new.GET_THREAD_LIST_BY_ID(parent_id),
            paramsObj
          )
          vm.pushReplyComments(reply_list, parent_id)
        } catch (e) {
          throw e
        } finally {
          /**
           * Switch expanded boolean on true
           */
          if (page < 2) vm.toggleExpanded(parent_id)
          /** */
        }
      },
      /**
       * Helpers
       */
      paginationMain({ page }: any, id: IdType) {
        const vm = this as any
        vm.getMainComments({ post_id: id, page })
      },
      paginationReply({ page }: any, id: IdType) {
        const vm = this as any
        vm.getReplyComments({ parent_id: id, page })
      },
      showThread(id: IdType) {
        const vm = this as any
        vm.getReplyComments({ parent_id: id })
      },
      /**
       * Websocket
       */
      connectSocket(id: IdType) {
        const vm = this as any
        vm.$echo.channel(`post.${id}`).listen('.new_comment', (e: any) => {
          vm.updateComments(e)
        })
      },
      destroySocket(id: IdType) {
        const vm = this as any
        vm.$echo.leave(`post.${id}`)
      },
      updateComments(e: any) {
        const vm = this as any
        const replyExist = e.comment.reply_to_comment !== null
        const replyId = e.comment.reply_to_comment
        const currComment = vm.main_comments_list.find(
          (comment: any) => comment.id === replyId
        )
        let socketComment = e.comment
        socketComment = { ...socketComment, is_anonymous: e.model.is_anonymous }
        const alreadyExpanded = currComment?.expanded
        if (replyExist && alreadyExpanded) {
          vm.unshiftReplyComments(socketComment, replyId)
          // vm.setReplyId(Number(replyId), Number(socketComment.id))
          return
        } else if (replyExist) {
          vm.unshiftReplyComments(socketComment, replyId)
          // vm.setReplyId(Number(replyId), Number(socketComment.id))
          return
        }
        vm.unshiftMainComment(socketComment)
        vm.pushMainId(Number(socketComment.id))
      }
    }
  })
