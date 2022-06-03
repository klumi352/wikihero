<template>
  <div class="post" :class="{ anonymous: !!postData.is_anonymous }">
    <div class="post__wrap a-df a-fdc">
      <div class="post__avatar">
        <div class="post__avatar--limit-wrap">
          <div class="post__avatar--wrap">
            <img
              v-if="!postData.is_anonymous"
              :src="postData.author.image.original_url"
              alt=""
              class="post__avatar--img"
            />
            <img
              v-else
              src="@/static/avatar.png"
              alt=""
              class="post__avatar--img"
            />
          </div>
        </div>
      </div>
      <div class="post__content">
        <h2 class="new-h1">
          {{ postData.title }}
        </h2>
        <div class="post__nav-wrap">
          <ul class="post__nav-list">
            <PostLinkBreadcrumbs
              is-group
              :prop-data="postData.group.title"
              :prop-url="`/${$route.params.topic}/${postData.group.slug}`"
            ></PostLinkBreadcrumbs>
            <PostLinkBreadcrumbs
              is-category
              :prop-data="postData.category.title"
              :prop-url="`/search?category_id=${postData.category.id}`"
            ></PostLinkBreadcrumbs>
            <PostLinkBreadcrumbs
              v-for="(hashtag, index) in postData.hashtags"
              :key="index"
              :prop-url="`/search?hashtag_id=${hashtag.id}`"
              :prop-data="hashtag.name"
            ></PostLinkBreadcrumbs>
          </ul>
        </div>
        <div
          class="post__description a-ffp g-p"
          v-html="postData.description"
        ></div>
        <span class="post__user-info a-ffr"
          >{{ !postData.is_anonymous ? `${postData.author.name} ·` : '' }}
          {{ postData.author.job_title }} · {{ postData.created_at }}</span
        >
        <div>
          <div class="rates">
            <div class="rates-wrap a-df a-jcsb">
              <div class="rates-item">
                <fetch-loading :class="{ loading: load1 }"
                  ><button
                    :disabled="load1 || load2 || load3"
                    class="btn"
                    :class="{ active: typeVote === 'worked' }"
                    @click="
                      toValidation(1, 'worked')
                      welcomeHandler()
                    "
                  >
                    {{
                      postData.category.special
                        ? $t('post.voting-special-icon-1st')
                        : $t('post.voting-default-icon-1st')
                    }}&nbsp;{{
                      postData.category.special === 0
                        ? $t(`tip.opt-1-${Number(!!postData.reactions.worked)}`)
                        : $t('post.voting-special-1st')
                    }}
                  </button>
                </fetch-loading>
                <div class="g-h4 rates-count">
                  {{
                    computeCount('worked')
                      | pluralize($t('tip.votes'), $t('tip.votes-plu'))
                  }}
                </div>
              </div>
              <div class="rates-item">
                <fetch-loading :class="{ loading: load2 }">
                  <button
                    :disabled="load1 || load2 || load3"
                    class="btn"
                    :class="{ active: typeVote === 'not_worked' }"
                    @click="toValidation(2, 'not_worked')"
                  >
                    {{
                      postData.category.special
                        ? $t('post.voting-special-icon-2nd')
                        : $t('post.voting-default-icon-2nd')
                    }}
                    &nbsp;{{
                      postData.category.special === 0
                        ? $t(
                            `tip.opt-2-${Number(
                              !!postData.reactions.not_worked
                            )}`
                          )
                        : $t('post.voting-special-2nd')
                    }}
                  </button>
                </fetch-loading>
                <div class="g-h4 rates-count">
                  {{
                    computeCount('not_worked')
                      | pluralize($t('tip.votes'), $t('tip.votes-plu'))
                  }}
                </div>
              </div>
              <div class="rates-item">
                <fetch-loading :class="{ loading: load3 }">
                  <button
                    :disabled="load1 || load2 || load3"
                    class="btn"
                    :class="{ active: typeVote === 'not_sure' }"
                    @click="toValidation(3, 'not_sure')"
                  >
                    🤔 &nbsp;{{
                      postData.category.special === 0
                        ? $t(
                            `tip.opt-3-${Number(!!postData.reactions.not_sure)}`
                          )
                        : $t('post.voting-special-3rd')
                    }}
                  </button>
                </fetch-loading>
                <div class="g-h4 rates-count">
                  {{
                    computeCount('not_sure')
                      | pluralize($t('tip.votes'), $t('tip.votes-plu'))
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="separator"></div>

        <div class="menu-buttons-wrap">
          <div class="menu-buttons a-df a-aic a-jcsb a-fwnw">
            <button
              class="g-btn"
              :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
            >
              {{
                checkPostCount
                  | pluralize(
                    $t('comment.single-comment-count'),
                    $t('comment.plural-comment-count'),
                    true
                  )
              }}</button
            ><button
              class="g-btn"
              :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
              @click="
                $root.$emit('show-modal', {
                  name: 'share-tip',
                  data: postData
                })
              "
            >
              <icon-share width="22" height="22" />{{ $t('tip.share') }}
            </button>
            <button
              class="g-btn"
              :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
              @click="
                $root.$emit('show-modal', {
                  name: 'flag-tip',
                  data: postData.id
                })
              "
            >
              <icon-flag width="22" height="22" />{{ $t('tip.flag') }}
            </button>
          </div>
        </div>
      </div>
      <CommentInput
        :post-id="post_page.id"
        :user-name="takeUserName"
        :user-avatar="returnProfileAvatar"
        @create-success="createCommentHandler"
      ></CommentInput>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'post-page';
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import post from './data.json'
import CommentInput from '@/chunk/forms/v-comment-input/comment-input.vue'
import PostLinkBreadcrumbs from '@/chunk/common/post-links-breadcrumbs/post-links-breadcrumbs.vue'
import { Api } from '@/api.config'
import { mt as mtAuth } from '@/store/auth'
export default Vue.extend({
  components: {
    CommentInput,
    PostLinkBreadcrumbs
  },
  props: {
    forceOpen: [Boolean],
    commentCount: Number,
    postData: [Object]
  },
  data() {
    return {
      post,
      load1: false,
      load2: false,
      load3: false,
      currTypeVote: null,
      postCounter: 0
    }
  },
  computed: {
    checkVote() {
      const vm = this as any
      return vm.currTypeVote && !vm.postData.type_vote
    },
    typeVote() {
      const vm = this as any
      return vm.currTypeVote || vm.postData.type_vote
    },
    ...mapState('tip', ['globalIsWorked', 'globalFilterType']),
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['loggedIn', 'isAdmin']),
    ...mapState('post', ['post_page']),
    takeUserAvatar() {
      const vm = this as any
      return vm.post_page?.author?.image?.original_url
    },
    takeUserName() {
      const vm = this as any
      return vm.post_page?.author?.name?.split(' ')[0]
    },
    returnProfileAvatar() {
      return this.user?.profile
        ? this.user?.profile?.avatar?.original_url
        : require('@/static/avatar.png')
    },
    checkPostCount() {
      return this.postCounter + this.commentCount + this.postData.count_comments
    }
  },
  methods: {
    welcomeHandler() {
      if (this.$route.query && this.$route.query.welcome) {
        const items =
          localStorage.getItem('onboard') &&
          JSON.parse(localStorage.getItem('onboard'))
        if (items) {
          localStorage.setItem(
            'onboard',
            JSON.stringify({ ...items, welcome: true })
          )
        } else {
          localStorage.setItem('onboard', JSON.stringify({ welcome: true }))
        }
        this.$router.push('/feed')
      }
    },
    createCommentHandler() {
      if (this.loggedIn) this.postCounter++
      this.welcomeHandler()
    },
    computeCount(type: any) {
      const vm = this as any
      const cw = vm.postData.reactions[type]
      const isInitial = vm.postData.type_vote === type
      const is = vm.typeVote === type
      if (isInitial && !is) return cw - 1
      return isInitial ? cw : is ? cw + 1 : cw
    },
    toValidation(num: number, type: string) {
      if (this.typeVote === type) return

      const vm = this
      let tempVote: any

      vm.$analytic.trackers['validate-post']()
      const worked = (() => {
        switch (num) {
          case 1:
            tempVote = 'worked'
            return tempVote
          case 2:
            tempVote = 'not_worked'
            return tempVote
          case 3:
            tempVote = 'not_sure'
            return tempVote
        }
      })()

      vm.$data[`load${num}`] = true
      vm.$axios
        .post(`/posts/${vm.postData.id}/react`, {
          reaction: worked
        })
        .then(({ data }) => {
          vm.$store.commit(`auth/${mtAuth.SET_USER_LEVEL}`, data.points)

          if (!vm.typeVote) {
            vm.$root.$emit('show-modal', {
              name: 'validating-tip',
              data: vm.postData.id
            })
          }
          vm.currTypeVote = tempVote
        })
        .finally(() => {
          vm.$data[`load${num}`] = false
        })
    }
  }
})
</script>
