<template>
  <div class="post-comment" :class="commentUse ? 'useInComment' : ''">
    <div class="post-comment__wrap">
      <div v-show="!commentUse" class="post-comment__avatar-wrap">
        <img :src="userAvatar" alt="" class="post-comment__avatar" />
      </div>
      <div class="post-comment__inputs-wrap useInComment">
        <div ref="quillWrap" class="post-comment__quill-wrap">
          <VueAreaInput
            :placeholder-value="`Aidez ${userName}...`"
            :area-value="params.body"
            :error-value="errors.body"
            @area-change="handler($event, { key: 'value' })"
          />
        </div>
        <div v-show="!loggedIn" class="post-comment__guest-wrap a-df">
          <span class="post-comment__guest-txt a-ffr"
            >{{ $t('post.post-as-guest') }}
            <nuxt-link
              class="post-comment__guest-link a-ffr"
              :to="`/login/?redirect=${$route.path}`"
              >{{ $t('sign.log-in') }}</nuxt-link
            ></span
          >
        </div>
      </div>
      <div>
        <!-- nologged -->
        <div v-if="!loggedIn" class="post-comment__no-log-wrap a-df">
          <div class="post-comment__no-log-inputs">
            <v-input
              v-if="!anonymously"
              name="author_name"
              :placeholder="$t('modal.full-name')"
              :value="params.author_name"
              :error="errors.author_name"
              @input="handler($event, { key: 'value' })"
            />
            <v-input
              name="author_job_title"
              :placeholder="$t('modal.job-title')"
              :value="params.author_job_title"
              :error="errors.author_job_title"
              @input="handler($event, { key: 'value' })"
            />
            <v-input
              name="email"
              :placeholder="'Email'"
              :value="params.email"
              type="email"
              :error="errors.email"
              :hint="$t('comment.email-hint')"
              @input="handler($event, { key: 'value' })"
            />
          </div>
          <div class="post-comment__checkbox-wrap a-df a-fdc">
            <div class="a-df a-aic a-fdc">
              <v-controll
                class="post-comment__checkbox"
                type="checkbox"
                name="is_anonymous"
                :hint="$t('modal.post-mod-anonim')"
                :checked="params.is_anonymous"
                @input="
                  handler($event, { key: 'checked' })
                  anonymously = !anonymously
                "
              >
              </v-controll>
              <span class="a-ffr">{{
                $t('modal.only-job-title-visible')
              }}</span>
            </div>
            <div class="post-comment__comment-btn-wrap">
              <button
                v-if="!commentUse"
                class="post-comment__comment-btn g-btn g-btn--fill"
                @click="createComment"
              >
                {{ $t('post.comment') }}
              </button>
            </div>
          </div>
        </div>
        <!-- nologged -->

        <!-- logged -->
        <div v-if="loggedIn && !commentUse" class="post-comment__checkbox-wrap">
          <div class="post-comment__logged-wrap a-df a-aic">
            <button
              class="post-comment__comment-btn g-btn g-btn--fill"
              @click="createComment"
            >
              {{ $t('post.comment') }}
            </button>
            <div class="a-df a-aic a-fdc">
              <v-controll
                class="post-comment__checkbox"
                type="checkbox"
                name="is_anonymous"
                :hint="$t('modal.post-mod-anonim')"
                :checked="params.is_anonymous"
                @input="
                  handler($event, { key: 'checked' })
                  anonymously = !anonymously
                "
              >
                <template v-slot:hintDesc>
                  <span class="a-ffr a-tal a-p0">{{
                    $t('modal.only-job-title-visible')
                  }}</span>
                </template>
              </v-controll>
            </div>
          </div>
          <div>
            <v-input
              v-if="anonymously && !loggedIn"
              name="author_job_title"
              :placeholder="$t('modal.job-title')"
              :value="params.author_job_title"
              :error="errors.author_job_title"
              @input="handler($event, { key: 'value' })"
            />
          </div>
        </div>
        <!-- logged -->
      </div>
      <div v-if="commentUse">
        <div v-if="loggedIn" class="post-comment__checkbox-wrap">
          <div class="a-df a-aic">
            <div class="a-df a-aic a-fdc">
              <v-controll
                class="post-comment__checkbox"
                type="checkbox"
                name="is_anonymous"
                :hint="$t('modal.post-mod-anonim')"
                :checked="params.is_anonymous"
                @input="
                  handler($event, { key: 'checked' })
                  anonymously = !anonymously
                "
              >
              </v-controll>
              <span class="a-ffr">{{
                $t('modal.only-job-title-visible')
              }}</span>
            </div>
          </div>
          <div>
            <v-input
              v-if="anonymously && !loggedIn"
              name="author_job_title"
              :placeholder="$t('modal.job-title')"
              :value="params.author_job_title"
              @input="handler($event, { key: 'value' })"
            />
          </div>
        </div>
        <div class="post-comment__btn-wrap">
          <button
            class="post-comment__comment-btn g-btn g-btn--fill"
            @click="createComment"
          >
            {{ $t('post.comment') }}
          </button>
          <button
            class="post-comment__cansel-btn g-btn"
            @click="$emit('click', false)"
          >
            {{ $t('comment.cancel') }}
          </button>
        </div>
      </div>
      <!-- no log info text -->
      <p
        v-show="commentUse && !loggedIn"
        class="post-comment__no-log-txt a-ffr"
      >
        {{ $t('modal.posted-success') }}
      </p>
      <!-- no log info text -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'comment-input';
</style>

<script>
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapGetters, mapState } from 'vuex'
import Vue from 'vue'
import isArray from 'lodash/isArray'
import { Api } from '@/api.config'
import VueAreaInput from '@/chunk/forms/v-text-area/v-text-area.vue'
export default {
  components: {
    VueAreaInput
  },
  props: {
    commentUse: Boolean,
    userName: String,
    postId: Number,
    commentId: Number,
    userAvatar: String
  },
  data() {
    return {
      showQuill: false,
      params: {
        author_name: '',
        author_job_title: '',
        body: '',
        reply_to_comment: null,
        email: '',
        is_anonymous: false
      },
      anonymously: false,
      errors: {}
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  },
  created() {
    this.params.reply_to_comment = this.commentId || null
  },
  methods: {
    async createComment() {
      try {
        await this.$axios.post(
          Api.new.CREATE_COMMENT_BY_ID(this.postId),
          this.params
        )
        if (!this.$store.getters['auth/loggedIn']) {
          this.$root.$emit('show-modal', {
            name: 'comment-create-modal'
          })
        }
        Vue.notification.success('update')
        this.$emit('create-success')
        this.setInitialValue()
        this.clearErrors()
      } catch (e) {
        this.setErrors(e.response.data)
        throw e
      }
    },
    handler(e, { key } = {}) {
      const checkbox = key === 'checked'
      if (checkbox) {
        this.clearErrors()
        Object.assign(this.params, {
          [e.target.name]: e.target[key] ? 1 : 0
        })
        return
      }
      this.clearErrors()
      Object.assign(this.params, {
        [e.target.name]: e.target[key]
      })
    },
    setInitialValue() {
      this.params = {
        author_name: '',
        author_job_title: '',
        body: '',
        reply_to_comment: this.commentId || null,
        email: '',
        is_anonymous: false
      }
      this.anonymously = false
    },
    setErrors(e) {
      Object.keys(e).forEach((key) => {
        this.$set(this.errors, key, isArray(e[key]) ? e[key].join(' ') : e[key])
      })
    },
    clearErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.$set(this.errors, key, '')
      })
    }
  }
}
</script>
