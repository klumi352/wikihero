<template>
  <li v-if="it" class="comment">
    <!-- Btn and dotted line wrap - start -->
    <button
      ref="follow"
      class="comment__vote--button a-df a-fdc a-jcc a-aic"
      :class="isVoted ? 'isVoted' : ''"
      @click="voteForComment"
    >
      <IconArrowTop class="comment__vote--arrow"></IconArrowTop>
      <span v-if="checkVoteAmount" class="comment__vote--number a-ffr">{{
        it.votes
      }}</span>
    </button>
    <!-- Tippy -->
    <div class="a-dn">
      <div ref="menu-buttons" class="filter-buttons">
        <nuxt-link
          :title="$t('header.signup')"
          :to="`/signup/?redirect=${$route.path}`"
          class="btn g-btn g-btn--link"
          >{{ $t('header.signup') }}</nuxt-link
        >
      </div>
    </div>
    <!--  -->
    <span class="comment__vertical-line"></span>
    <!-- Btn and dotted line wrap - finish -->
    <div class="comment__wrap">
      <div class="comment__content a-ffp" v-html="it.body"></div>

      <!-- Comment section - start -->
      <div class="comment__bottom-section a-df a-aic">
        <div class="comment__bottom-section--start-wrap a-df a-aic">
          <img
            v-if="!it.is_anonymous"
            :src="checkAvatarExist"
            alt=""
            class="comment__bottom-section--avatar"
          />
          <img
            v-else
            src="@/static/avatar.png"
            alt=""
            class="comment__bottom-section--avatar"
            :class="{ anonymous: !!it.is_anonymous }"
          />
        </div>
        <div class="comment__bottom-section__col">
          <div class="comment__bottom-section__flex">
            <span v-if="showAuthorLabel" class="comment__autor__pc a-ffr">
              {{ $t('comment.author-label') }}
            </span>
            <span
              v-if="!it.is_anonymous"
              class="comment__bottom-section--user-info a-ffr"
              >{{
                `${it.author_name === null ? '' : it.author_name + ' · '}${
                  it.author_job_title === null ? '' : it.author_job_title
                }${it.created_at === null ? '' : ' · ' + it.created_at}`
              }}</span
            >
            <span v-else class="comment__bottom-section--user-info a-ffr">{{
              `${$t('comment.anonymous-placeholder') + ' · '}
              ${it.author_job_title === null ? '' : it.author_job_title}
              ${it.created_at === null ? '' : ' · ' + it.created_at}`
            }}</span>
          </div>
          <div class="comment__bottom-section--btn-wrap a-df a-aic">
            <span v-if="showAuthorLabel" class="comment__autor__mobile a-ffr">
              {{ $t('comment.author-label') }}
            </span>
            <span style="color: var(--c-brand);">&#183;</span>
            <button
              class="comment__bottom-section--reply-btn a-ffb"
              @click="showInputSection"
            >
              {{ $t('comment.reply-button-message') }}
            </button>
          </div>
        </div>
      </div>
      <!-- Comment section - finish -->

      <!-- Thread section - start -->
      <div v-if="mainComments">
        <div
          v-if="checkNestedState && !it.expanded"
          class="comment__avatars-section a-df"
        >
          <ul class="a-df">
            <li v-for="(user, index) in it.thread_users" :key="index">
              <img
                :src="user.original_url"
                alt=""
                class="comment__bottom-section--avatar"
              />
            </li>
          </ul>
          <span class="a-df a-aic a-ffr">
            <span class="dark"
              >{{ `${it.thread_comments_count}` }}
              {{ $t('comment.replies') }}</span
            ><span class="separator">&#183;</span
            ><span
              ref="thread"
              class="thread"
              @click="showThreadSection"
              @mouseover="showThreadTxt"
              @mouseleave="showCommonTxt"
              >{{ it.created_at }}</span
            >
          </span>
        </div>
      </div>
      <!-- Thread section - finish -->
    </div>
    <!-- Hidden comment input section with stepper - start -->
    <v-stepper
      ref="stepper"
      v-model="currentStep"
      preloader-position="top"
      preloader-top
    >
      <v-step visible></v-step>
      <v-step>
        <div>
          <CommentInput
            comment-use
            no-logged
            :comment-id="mainCommentId ? Number(mainCommentId) : Number(it.id)"
            :post-id="Number(postId)"
            :user-avatar="it.author_avatar.original_url"
            :user-name="
              !it.is_anonymous
                ? it.author_name
                : $t('comment.anonymous-placeholder')
            "
            @click="closeInputSection"
            @create-success="
              () => {
                closeInputSection()
                welcomeHandler()
              }
            "
          ></CommentInput>
        </div>
      </v-step>
    </v-stepper>
    <!-- Hidden comment input section with stepper - finish -->

    <!-- Nested comments - start -->
    <div v-show="!checkNestedState || it.expanded">
      <ul class="comment__nested-list">
        <slot></slot>
      </ul>
      <slot name="pagination"></slot>
    </div>
    <!-- Nested comments - finish -->
  </li>
</template>

<style lang="scss" scoped>
@import 'comments';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapState, mapGetters } from 'vuex'
import tippy from 'tippy.js'
import IconArrowTop from '@/chunk/__svg/icon-arrow-top.svgm'
import CommentInput from '@/chunk/forms/v-comment-input/comment-input.vue'

export default {
  components: {
    IconArrowTop,
    CommentInput
  },
  props: {
    nestedComments: {
      type: Boolean,
      default() {
        return false
      }
    },
    mainComments: {
      type: Boolean,
      default() {
        return false
      }
    },
    it: {
      type: Object,
      default() {
        return {}
      }
    },
    mainCommentId: {
      type: Number
    },
    postId: {
      type: Number
    },
    postAuthorId: {
      type: Number
    }
  },
  data() {
    return {
      localVote: 0,
      isVoted: false,
      isAutor: true,
      currentStep: 0
    }
  },
  computed: {
    checkVoteAmount() {
      return this.voteNumber !== 0
    },
    ...mapState('post', ['post_page']),
    ...mapState('auth', ['user']),
    checkAvatarExist() {
      return this.it?.author_avatar?.original_url
    },
    checkNestedState() {
      return this.it?.thread_comments_count >= 4
    },
    ...mapGetters('auth', ['loggedIn', 'tempUser']),
    showAuthorLabel() {
      return this.it.author_id === this.postAuthorId && !this.it.is_anonymous
    }
  },
  created() {
    this.it.user_voted
      ? ((this.localVote = 1), (this.isVoted = true))
      : ((this.localVote = 0), (this.isVoted = false))
  },
  mounted() {
    const follow = this.$refs.follow
    if (follow && !this.loggedIn) {
      const tippyInstance = tippy(follow, {
        appendTo: () => document.body,
        placement: 'bottom',
        animation: 'fade',
        trigger: 'click',
        zIndex: 99,
        interactive: true,
        allowHTML: true,
        theme: 'drop'
      })
      tippyInstance.popper
        .querySelector('.tippy-content')
        .append(this.$refs['menu-buttons'])

      this.$on('close', () => {
        tippyInstance.hide()
      })

      this.$once('hook:beforeDestroy', () => {
        tippyInstance.destroy()
      })
    }
  },
  methods: {
    showInputSection() {
      this.currentStep = 1
    },
    closeInputSection() {
      this.currentStep = 0
      this.$emit('create-success')
    },
    async voteForComment() {
      if (this.loggedIn) {
        /* start */
        if (this.it.user_voted) {
          if (this.localVote === 0) {
            const result = await this.$axios.post(
              `/comments/${this.it?.id}/upvote`
            )
            this.it.votes += result.vote
            this.localVote = result.vote
            this.isVoted = true
          } else {
            const result = await this.$axios.post(
              `/comments/${this.it?.id}/downvote`
            )
            this.it.votes > 0 ? (this.it.votes -= 1) : (this.it.votes = 0)
            this.localVote = result.vote
            this.isVoted = false
          }
        } else if (!this.it.user_voted) {
          if (this.localVote === 0) {
            const result = await this.$axios.post(
              `/comments/${this.it?.id}/upvote`
            )
            this.it.votes += result.vote
            this.localVote = result.vote
            this.isVoted = true
          } else {
            const result = await this.$axios.post(
              `/comments/${this.it?.id}/downvote`
            )
            this.it.votes > 0 ? (this.it.votes -= 1) : (this.it.votes = 0)
            this.localVote = result.vote
            this.isVoted = false
          }
        }
        /* finish */
      }
    },
    showThreadSection() {
      this.$emit('expand', this.it?.id)
    },
    showThreadTxt() {
      this.$refs.thread.textContent = this.$t('comment.show-tread')
    },
    showCommonTxt() {
      this.$refs.thread.textContent = ` ${this.it.created_at}`
    },
    welcomeHandler() {
      if (this.$route.query && this.$route.query.filter) {
        const items =
          localStorage.getItem('onboard') &&
          JSON.parse(localStorage.getItem('onboard'))
        if (items) {
          localStorage.setItem(
            'onboard',
            JSON.stringify({ ...items, filter: true })
          )
        } else {
          localStorage.setItem('onboard', JSON.stringify({ filter: true }))
        }
        this.$router.push('/feed')
      }
    }
  }
}
</script>
