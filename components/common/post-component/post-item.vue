<template>
  <!-- eslint-disable vue/no-v-html -->
  <li :class="!showPreview ? 'opened' : ''" class="post-class">
    <div class="post">
      <div class="post__wrap">
        <div class="post__top-wrap">
          <div class="post__avatar-wrap">
            <img
              v-if="!post.is_anonymous"
              :src="returnUserAvatar"
              alt=""
              class="post__avatar"
            />
            <img
              v-else
              src="@/static/avatar.png"
              alt=""
              class="post__avatar"
              :class="{ anonymous: !!post.is_anonymous }"
            />
          </div>
          <div class="post__header">
            <nuxt-link
              :to="post.computed_slug"
              class="post__title a-ffb highlight-wrap"
              target="_blank"
              v-html="post.title"
            />
            <button class="btn-close" @click="close">
              <icon-close class="btn-ico close-ico" width="16" height="16" />
            </button>
          </div>
          <div class="post__nav-wrap">
            <ul>
              <PostLinkBreadcrumbs
                is-group
                :prop-data="fetchGroupTitle"
                :prop-url="urlForPost()"
              ></PostLinkBreadcrumbs>
              <PostLinkBreadcrumbs
                is-category
                :prop-data="post.category.title"
                :prop-url="`/search?category_id=${post.category.id}`"
              ></PostLinkBreadcrumbs>
              <PostLinkBreadcrumbs
                v-for="(hashtag, index) in post.hashtags"
                :key="index"
                :prop-url="`/search?hashtag_id=${hashtag.id}`"
                :prop-data="hashtag.name"
              ></PostLinkBreadcrumbs>
            </ul>
          </div>
        </div>
        <div class="post__content-wrap">
          <v-stepper
            ref="stepper"
            v-model="currentStep"
            preloader-position="top"
            preloader-top
          >
            <v-step visible
              ><div class="post__overflow-wrap">
                <div
                  class="post__preview-txt a-fz-18-20 highlight-wrap"
                  v-html="
                    replaceSpacesFromDescription(post.preview_description)
                  "
                ></div>
                <button class="post__btn-more a-ffr a-fz-14-16" @click="open">
                  {{ $t('post.preview-end') }}
                </button>
              </div>
            </v-step>
            <v-step>
              <div class="post__main-txt">
                <div
                  class="post__main-description a-fz-18-20 highlight-wrap"
                  v-html="post.description"
                ></div>
                <!-- rates -->

                <div class="rates">
                  <div class="rates-wrap">
                    <div class="rates-item">
                      <fetch-loading :class="{ loading: load1 }"
                        ><button
                          :disabled="load1 || load2 || load3"
                          class="btn"
                          :class="{ active: typeVote === 'worked' }"
                          @click="toValidation(1, 'worked')"
                        >
                          {{
                            post.category.special
                              ? $t('post.voting-special-icon-1st')
                              : $t('post.voting-default-icon-1st')
                          }}&nbsp;{{
                            post.category.special === 0
                              ? $t('post.voting-default-1st')
                              : $t('post.voting-special-1st')
                          }}
                        </button>
                      </fetch-loading>
                      <div class="g-h4 rates-count">
                        {{
                          computeCount('worked')
                            | pluralize(
                              $t('post.votes-default'),
                              $t('post.votes-upgrade')
                            )
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
                            post.category.special
                              ? $t('post.voting-special-icon-2nd')
                              : $t('post.voting-default-icon-2nd')
                          }}&nbsp;{{
                            post.category.special === 0
                              ? $t('post.voting-default-2nd')
                              : $t('post.voting-special-2nd')
                          }}
                        </button>
                      </fetch-loading>
                      <div class="g-h4 rates-count">
                        {{
                          computeCount('not_worked')
                            | pluralize(
                              $t('post.votes-default'),
                              $t('post.votes-upgrade')
                            )
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
                          {{
                            post.category.special
                              ? $t('post.voting-special-icon-3rd')
                              : $t('post.voting-default-icon-3rd')
                          }}&nbsp;{{
                            post.category.special === 0
                              ? $t('post.voting-default-3rd')
                              : $t('post.voting-special-3rd')
                          }}
                        </button>
                      </fetch-loading>
                      <div class="g-h4 rates-count">
                        {{
                          computeCount('not_sure')
                            | pluralize(
                              $t('post.votes-default'),
                              $t('post.votes-upgrade')
                            )
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="separator"></div>

                <div class="menu-buttons-wrap">
                  <div class="menu-buttons a-df a-aic a-jcsb a-fwnw">
                    <button
                      class="menu-buttons__first g-btn"
                      :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
                    >
                      {{
                        checkPostCount
                          | pluralize(
                            $t('comment.single-comment-count'),
                            $t('comment.plural-comment-count'),
                            true
                          )
                      }}
                    </button>
                    <button
                      class="g-btn"
                      :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
                      @click="
                        $root.$emit('show-modal', {
                          name: 'share-tip',
                          data: post
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
                          data: post.id
                        })
                      "
                    >
                      <icon-flag width="22" height="22" />{{ $t('tip.flag') }}
                    </button>
                  </div>
                </div>
                <CommentInput
                  :post-id="post.id"
                  :user-avatar="returnProfileAvatar"
                  :user-name="returnUserName"
                  @create-success="createCommentHandler"
                ></CommentInput>
              </div>
              <!-- Comments list -->
              <CommentList
                :page-id="post.id"
                :post-author-id="post.author.user_id"
                @create-success="createCommentHandler"
              ></CommentList>
              <!--  -->
            </v-step>
          </v-stepper>
        </div>
        <div v-if="showPreview" class="post__bottom-wrap">
          <span class="post__bottom-user-info a-ffr"
            >{{ post.is_anonymous === 0 ? `${post.author.name} · ` : '' }}
            {{ post.author.job_title }}{{ ` · ${post.created_at}` }}</span
          >
          <div class="post__btns-collection">
            <div class="post__left">
              <ul>
                <li>
                  <button
                    class="post__child-button a-ffr"
                    :disabled="load1 || load2 || load3"
                    :class="{ active: typeVote === 'worked' }"
                    @click="toValidation(1, 'worked')"
                  >
                    {{
                      post.category.special
                        ? $t('post.voting-special-icon-1st')
                        : $t('post.voting-default-icon-1st')
                    }}
                    <span>{{ computeCount('worked') }}</span>
                  </button>
                  <span class="post__tooltip a-ffr">{{
                    post.category.special === 0
                      ? $t('post.voting-default-1st')
                      : $t('post.voting-special-1st')
                  }}</span>
                </li>
                <!-- старт -->
                <li>
                  <button
                    class="post__child-button a-ffr"
                    :disabled="load1 || load2 || load3"
                    :class="{ active: typeVote === 'not_worked' }"
                    @click="toValidation(2, 'not_worked')"
                  >
                    {{
                      post.category.special
                        ? $t('post.voting-special-icon-2nd')
                        : $t('post.voting-default-icon-2nd')
                    }}
                    <span>{{ computeCount('not_worked') }}</span>
                  </button>
                  <span class="post__tooltip a-ffr">{{
                    post.category.special === 0
                      ? $t('post.voting-default-2nd')
                      : $t('post.voting-special-2nd')
                  }}</span>
                </li>
                <!-- фініш -->
                <li>
                  <button
                    class="post__child-button a-ffr"
                    :disabled="load1 || load2 || load3"
                    :class="{ active: typeVote === 'not_sure' }"
                    @click="toValidation(3, 'not_sure')"
                  >
                    {{
                      post.category.special
                        ? $t('post.voting-special-icon-3rd')
                        : $t('post.voting-default-icon-3rd')
                    }}
                    <span>{{ computeCount('not_sure') }}</span>
                  </button>
                  <span class="post__tooltip a-ffr">{{
                    post.category.special === 0
                      ? $t('post.voting-default-3rd')
                      : $t('post.voting-special-3rd')
                  }}</span>
                </li>
              </ul>
            </div>
            <div class="post__right">
              <ul>
                <li>
                  <button class="a-ffr" @click="open">
                    <IconMessage class="post__social-ico"></IconMessage
                    ><span v-if="checkPostCount > 0">{{ checkPostCount }}</span>
                  </button>
                </li>
                <li>
                  <button
                    class="a-ffr"
                    @click="
                      $root.$emit('show-modal', {
                        name: 'share-tip',
                        data: post
                      })
                    "
                  >
                    <IconShareNew class="post__social-ico"></IconShareNew>
                  </button>
                </li>
                <li>
                  <button class="a-ffr">
                    <button
                      class="a-ffr"
                      @click="
                        $root.$emit('show-modal', {
                          name: 'flag-tip',
                          data: post.id
                        })
                      "
                    >
                      <IconFlagNew class="post__social-ico"></IconFlagNew>
                    </button>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="show_point">
              <PointPost></PointPost>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
@import 'post-item';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import { mapGetters, mapState } from 'vuex'
import CommentList from '@/components/common/comment-list-component/comment-list.vue'
import CommentInput from '@/chunk/forms/v-comment-input/comment-input.vue'
import IconShareNew from '@/chunk/__svg/icon-share-new.svgm'
import IconMessage from '@/chunk/__svg/icon-message.svgm'
import IconFlagNew from '@/chunk/__svg/icon-flag-new.svgm'
import IconShare from '@/chunk/__svg/icon-share.svgm'
import IconFlag from '@/chunk/__svg/icon-flag.svgm'
import PostLinkBreadcrumbs from '@/chunk/common/post-links-breadcrumbs/post-links-breadcrumbs.vue'
import PointPost from '@/components/post/__modals/point-post/point-post.vue'
import { mt as mtAuth } from '@/store/auth'
import { Api } from '@/api.config'
import { SearchResultItemMixin } from '~/plugins/vue-extend/mixins/-search-result-item-mixin'
import { CommentMixin } from '~/plugins/vue-extend/mixins/-comment-mixin'

export default {
  components: {
    CommentInput,
    IconShareNew,
    IconMessage,
    IconFlagNew,
    CommentList,
    IconShare,
    IconFlag,
    PostLinkBreadcrumbs,
    PointPost
  },
  props: {
    mark: {
      type: Function,
      default: () => {}
    },
    isVotes: Boolean,
    forceOpen: Boolean,
    underLimit: Boolean,
    post: Object
  },
  data() {
    return {
      load1: false,
      load2: false,
      load3: false,
      hover1: false,
      hover2: false,
      hover3: false,
      showPreview: this.post.showPreview,
      currentStep: this.post.currentStep,
      limitTipPercent: process.env.LIMIT_TIP_PERCENT || 10,
      currTypeVote: null,
      show_point: false,
      postCounter: 0
    }
  },
  computed: {
    checkVote() {
      return this.currTypeVote && !this.post.type_vote
    },
    checkPostCount() {
      return this.postCounter + this.post.count_comments
    },
    typeVote() {
      return this.currTypeVote || this.post.type_vote
    },
    ...mapState('tip', ['globalIsWorked', 'globalFilterType']),
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['loggedIn', 'isAdmin']),
    returnUserName() {
      return this.post?.author?.name?.split(' ')[0]
    },
    returnUserAvatar() {
      return this.post?.author?.image?.original_url
    },
    returnProfileAvatar() {
      return this.loggedIn
        ? this.user?.profile?.avatar?.original_url
        : require('@/static/avatar.png')
    },
    fetchGroupTitle() {
      return this.post?.group?.title
    }
  },
  mounted() {
    this.$emit('onmount')
  },
  methods: {
    replaceSpacesFromDescription(txt) {
      return txt.replace(/&nbsp(?:;?)/gi, '\u00A0').trim()
    },
    createCommentHandler() {
      if (this.loggedIn) this.postCounter++
      this.welcomeHandler()
    },
    open() {
      this.showPreview = false
      this.currentStep = 1
      setTimeout(() => {
        this.mark()
      }, 500)
    },
    close() {
      this.showPreview = true
      this.currentStep = 0
    },
    computeCount(type) {
      const vm = this
      const cw = vm.post.reactions[type]
      const isInitial = this.post.type_vote === type
      const is = vm.typeVote === type
      if (isInitial && !is) return cw - 1
      return isInitial ? cw : is ? cw + 1 : cw
    },
    toValidation(num, type) {
      this.$store.commit('post/POST_CREATE_INITIAL')
      if (this.typeVote === type) return
      const vm = this
      let tempVote

      this.$analytic.trackers['validate-post']()
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

      this.$data[`load${num}`] = true
      this.$axios
        .post(Api.new.POST_REACT(this.post.id), {
          reaction: worked
        })
        .then(({ data }) => {
          this.$store.commit(`auth/${mtAuth.SET_USER_LEVEL}`, data.points)
          if (!this.typeVote) {
            if (!this.$store.getters['auth/loggedIn']) {
              this.$root.$emit('show-modal', {
                name: 'validating-tip',
                data: this.post.id
              })
            } else {
              this.show_point = true
              setTimeout(() => {
                this.show_point = false
              }, 2500)
            }
          }
          vm.currTypeVote = tempVote
        })
        .finally(() => {
          this.$data[`load${num}`] = false
        })
    },
    urlForPost() {
      const vm = this
      return `/${vm.post.topic?.slug}/${vm.post.group?.slug}`
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
