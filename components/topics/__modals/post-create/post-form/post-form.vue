<template>
  <div class="post-create" :class="[!getLoad || loading ? 'showLoader' : '']">
    <div class="post-create__overlay">
      <img
        class="ico"
        width="60"
        height="60"
        src="~assets/svg/icon-preloader.svg"
        alt=""
      />
    </div>
    <div class="post-create__wrap">
      <div class="post-create__top a-df a-aic">
        <h2 class="post-create__top--title a-ffb">
          {{ $t('modal-post-create.main-title') }}
        </h2>
        <PostGroupSelect
          :data="{ getNoSub, getSub }"
          :form-value="form"
          :store-value="group_page"
          :current-page="groupPath"
          :search-input="searchText"
          :searching="searchLoading"
          :error="errors.group_id"
          @input="search"
          @select="handler"
        />
      </div>
      <span v-if="!loggedIn" class="post-create__notLogged a-ffr"
        >{{ $t('modal-post-create.nonlogged-txt') }}
        <nuxt-link to="/login" class="post-create__notLogged-link">{{
          $t('modal-post-create.nonlogged-link')
        }}</nuxt-link>
      </span>

      <div class="post-create__main">
        <div>
          <span class="post-create__main--title a-ffr">{{
            $t('modal-post-create.subtitle-top')
          }}</span>
          <div class="post-create__main--form-wrap a-df a-fdc">
            <v-input
              :value="form.title"
              name="title"
              :placeholder="$t('modal-post-create.title-placeholder')"
              :error="errors.title"
              :max-length="100"
              :hint="$t('modal-tip.1st-hint')"
              post-create
              @input="handle"
            />
            <v-quill
              class="post-create__main--quill"
              with-toolbar
              :placeholder="$t('modal-post-create.description')"
              :value="form.description"
              name="description"
              :error="errors.description"
              @input="handle"
            />

            <PostSelectSearchForHashtag
              :input-value="searchHashtag"
              :hashtags-list="hashtagsData"
              :store-value="form.hashtags"
              :state-obj="'form'"
              @input="hashtagHandler"
              @select="hashtagSelect"
              @key-press="hashtagSelect"
              @delete="deleteHandler"
              @focus="getHashtags"
            />

            <div class="post-create__main--bottom a-df a-jcsb a-aic">
              <PostSelectCheckbox
                :data="getCateg"
                :name="'PostCreateCategory'"
                :form-value="form.category_id"
                :error="errors.category_id"
                :title="$t('modal-post-create.category')"
                @select="categoryHandler"
              />

              <div class="post-create__main--checkbox a-df a-aic">
                <div class="a-df a-fdc a-ffr">
                  <span>{{ $t('modal-post-create.optional') }}</span>
                  <span>{{ $t('modal-post-create.info') }}</span>
                </div>
                <v-controll
                  class="post-create__main--checker a-df a-aic"
                  type="checkbox"
                  name="is_anonymous"
                  :checked="form.is_anonymous"
                  @input="
                    handle($event, { key: 'checked' })
                    anonymous = !anonymous
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loggedIn">
          <span class="post-create__main--title a-ffr">{{
            $t('modal-post-create.subtitle-bottom')
          }}</span>
          <div class="post-create__main--form-wrap a-df a-fdc">
            <ul class="post-create__main--hidden-list a-df a-fww">
              <li>
                <v-input
                  v-if="!form.is_anonymous"
                  :value="form.first_name"
                  name="first_name"
                  :placeholder="$t('modal-post-create.name')"
                  :error="errors.first_name"
                  @input="handle"
                />
              </li>
              <li>
                <v-input
                  v-if="!form.is_anonymous"
                  :value="form.last_name"
                  name="last_name"
                  :placeholder="$t('modal-post-create.surname')"
                  :error="errors.last_name"
                  @input="handle"
                />
              </li>
              <li>
                <v-input
                  :value="form.job_title"
                  name="job_title"
                  :placeholder="$t('modal-post-create.job')"
                  :error="errors.job_title"
                  @input="handle"
                />
              </li>
              <li>
                <v-input
                  :value="form.email"
                  name="email"
                  type="email"
                  :placeholder="$t('modal-post-create.email')"
                  :error="errors.email"
                  :hint="$t('post.email-hint')"
                  @input="handle"
                />
              </li>
            </ul>
          </div>
        </div>

        <div class="post-create__main--btns-wrap a-df a-jcfe">
          <div class="post-create__main--btns a-df a-jcsb">
            <button
              class="g-btn"
              :disabled="!formFullFill"
              @click="$emit('switch', 'post-preview')"
            >
              {{ $t('modal-post-create.preview') }}
            </button>
            <button class="g-btn g-btn--fill" @click="post">
              {{ $t('modal-post-create.confirm') }}
            </button>
          </div>
        </div>

        <div
          v-if="!loggedIn"
          class="post-create__main--footer-info a-df a-jcfe"
        >
          <span class="a-ffr">{{ $t('modal-post-create.bottom-txt') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'post-form';
</style>

<script>
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import debounce from 'lodash/debounce'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { Api } from '@/api.config'
import PostGroupSelect from '@/components/topics/__modals/post-create/ui/group-select/group-select.vue'
import PostSelectCheckbox from '@/components/topics/__modals/post-create/ui/category-select/category-select.vue'
import PostSelectSearchForHashtag from '@/chunk/forms/v-select-search-for-hashtag/v-select-search-for-hashtag.vue'

export default Vue.extend({
  components: {
    PostGroupSelect,
    PostSelectCheckbox,
    PostSelectSearchForHashtag
  },
  data() {
    return {
      searchText: '',
      searchHashtag: '',
      hashtagsData: {
        data: []
      },
      anonymous: false,
      searchLoading: false,
      loading: false
    }
  },
  watch: {
    searchText(v) {
      this.fetchGroupSearch(v)
    },
    searchHashtag(v) {
      this.fetchSearch(v, Api.new.SEARCH_HASHTAG, this.setHashtagBySearch)
    }
  },
  computed: {
    ...mapState('post', ['form', 'errors', 'form_help']),
    ...mapState('group', ['group_page']),
    ...mapGetters('post-create', ['getNoSub', 'getSub', 'getCateg', 'getLoad']),
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('post', ['formFullFill', 'isTagExist', 'replaceTagExist']),
    groupData() {
      return this.$store.state.group.group_page
    },
    groupPath() {
      return this.$route.name === 'topic-group'
    }
  },
  methods: {
    hashtagHandler(v) {
      this.searchHashtag = v.target.value
    },
    handler(v) {
      if (this.loggedIn) {
        this.SET_FORM_HELP({
          name: 'groupUrlRedirect',
          value: v.computed_slug
        })
      }
      this.HANDLE_FORM_INPUT({
        name: 'group_id',
        value: v.id
      })
      this.HANDLE_FORM_INPUT({
        name: 'topic_id',
        value: v.topic.id
      })
      if (v.id != null) this.$emit('fetch-category', v.categories)
      this.$store.commit('post/CLEAR_FORM_ERROR')
      this.$store.commit('post/CLEAR_FORM_PARAM', {
        name: 'category_id',
        value: null
      })
    },
    categoryHandler(v) {
      this.HANDLE_FORM_INPUT({
        name: 'category_id',
        value: v.id
      })
    },
    handle(e, { key = 'value' } = {}) {
      this.HANDLE_FORM_INPUT({
        name: e.target.name,
        value: e.target[key]
      })
    },
    search(v) {
      this.searchText = v.target.value
    },
    setHashtagBySearch(fetchData) {
      this.hashtagsData.data = fetchData
    },
    /* Fetch data with debounce */
    fetchSearch: debounce(async function(search = '', url, call) {
      const s = { params: { search } }
      const { data } = await this.$axios.get(url, s)
      call(data)
    }, Number(process.env.REQUEST_DEBOUNCE)),
    fetchGroupSearch: debounce(async function(search = '') {
      this.searchLoading = true
      await this.$store.dispatch('post-create/FETCH_GROUPS', { search })
      setTimeout(() => {
        this.searchLoading = false
      }, 150)
    }, Number(process.env.REQUEST_DEBOUNCE)),
    /* --- */
    ...mapMutations('post', [
      'HANDLE_FORM_INPUT',
      'PUSH_HASHTAG_NAME',
      'DELETE_LAST_HASHTAG',
      'CLEAR_FORM_ERROR',
      'SET_FORM_HELP'
    ]),
    hashtagSelect(v) {
      const vm = this
      if (vm.isTagExist({ value: v || vm.searchHashtag, obj: 'form' })) return
      if (v.charAt(0) === '#') {
        vm.PUSH_HASHTAG_NAME({
          value: v,
          obj: 'form'
        })
        vm.searchHashtag = ''
        return
      }
      if (
        vm.searchHashtag.charAt(0) !== '#' &&
        !vm.replaceTagExist({ value: v || vm.searchHashtag, obj: 'form' })
      ) {
        vm.PUSH_HASHTAG_NAME({
          value: `#${v}`,
          obj: 'form'
        })
        vm.searchHashtag = ''
      }
    },
    ...mapActions('post', ['CREATE_POST']),
    post() {
      this.$emit('post')
    },
    deleteHandler(e) {
      const checkValueLength = e.target.value.length === 0
      const hashtagsLength = this.form.hashtags.length - 1
      if (checkValueLength)
        this.DELETE_LAST_HASHTAG({ value: hashtagsLength, obj: 'form' })
    },
    async getHashtags() {
      const vm = this
      const { data } = await vm.$axios.get(Api.new.SEARCH_HASHTAG, '')
      vm.hashtagsData.data = data
    }
  }
})
</script>
