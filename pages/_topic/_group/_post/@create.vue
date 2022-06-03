<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <Photoloader
            :image-url="form.logo"
            @upload="imageHandler"
          ></Photoloader>
          <div class="post-create-admin">
            <!-- <PostSelect
              :name="'group_id'"
              :select-title="$t('post.select-group')"
              :follow-data="followData"
              :list-data="groupsData"
              :search-input="searchGroup"
              :store-value="form.group_id"
              admin-use
              :error="errors.group_id"
              :second-name="'topic_id'"
              @select="groupHandler"
              @input="search"
            /> -->
            <PostGroupSelect
              :data="{ getNoSub, getSub }"
              :form-value="form"
              :store-value="post_page.group"
              :current-page="false"
              :search-input="searchGroup"
              :searching="searchLoading"
              :error="errors.group_id"
              @input="search"
              @select="groupHandler"
            />
            <!-- <PostSelectCheckbox
              :name="'category_id'"
              :select-title="$t('post.select-category')"
              :list-data="categoriesData"
              :store-value="form.category_id"
              admin-use
              :error="errors.category_id"
              @check="categoryHandler"
            /> -->
            <PostSelectCheckbox
              :data="getCateg"
              :name="'PostCreateCategory'"
              :form-value="form.category_id"
              :error="errors.category_id"
              :title="$t('modal-post-create.category')"
              @select="categoryHandler"
            />
          </div>
          <PostSelectSearchForHashtag
            :input-value="searchHashtag"
            :hashtags-list="hashtagsData"
            :store-value="form.hashtags"
            admin-use
            :state-obj="'form'"
            @input="hashtagHandler"
            @select="hashtagSelect"
            @key-press="hashtagSelect"
            @delete="deleteHandler"
            @focus="getHashtags"
          />
          <v-input
            :disabled="true"
            name="slug"
            :placeholder="$t('table.slug')"
            :error="errors.slug"
            :value="form.slug"
            @input="inputHandler"
            @keypress.enter="store"
          />
          <v-input
            name="title"
            :placeholder="'Title'"
            :error="errors.title"
            :value="form.title"
            @input="inputHandler"
            @keypress.enter="store"
          />
          <v-quill
            with-toolbar
            :placeholder="$t('table.description')"
            :value="form.description"
            :error="errors.description"
            name="description"
            @input="inputHandler"
          />
          <v-controll
            type="checkbox"
            name="is_anonymous"
            :checked="form.is_anonymous"
            :hint="$t('post.admin-warning')"
            @input="inputHandler($event, { key: 'checked' })"
          />
          <v-input
            v-if="!form.is_anonymous"
            :value="form.first_name"
            name="first_name"
            :placeholder="'Name'"
            @input="inputHandler"
          />
          <v-input
            v-if="!form.is_anonymous"
            :value="form.last_name"
            name="last_name"
            :placeholder="'Surname'"
            @input="inputHandler"
          />
          <v-input
            :value="form.job_title"
            name="job_title"
            :placeholder="'Job title'"
            @input="inputHandler"
          />
          <v-input
            v-if="!form.is_anonymous"
            :value="form.email"
            name="email"
            type="email"
            :placeholder="'Email'"
            @input="inputHandler"
          />
          <seo-module
            :errors="errors"
            :data="form"
            @was-keypress="store"
            @input="inputHandler"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.creating') }}</h1>
          <h3>
            <b>{{ $t('admin.create-post') }}</b> {{ $t('global.topic') }}
          </h3>
          <fetch-loading class="top" :class="{ loading }">
            <button :disabled="loading" class="g-btn" @click="store">
              {{ $t('global.save') }}
            </button>
          </fetch-loading>
        </div>
      </template>
    </layout-2>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import debounce from 'lodash/debounce'
import { mapState, mapGetters } from 'vuex'
import Photoloader from '@/chunk/forms/v-photoloader/v-photoloader.vue'
import PostGroupSelect from '@/components/topics/__modals/post-create/ui/group-select/group-select.vue'
import { MutationsList } from '@/store/post'
import { Api } from '@/api.config'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-post'
import PostSelectCheckbox from '@/components/topics/__modals/post-create/ui/category-select/category-select.vue'
import PostSelectSearchForHashtag from '@/chunk/forms/v-select-search-for-hashtag/v-select-search-for-hashtag.vue'

export default AdminMixins({ compareRoute: 'topic-group-post-@create' }).extend(
  {
    components: {
      Photoloader,
      PostGroupSelect,
      PostSelectCheckbox,
      PostSelectSearchForHashtag
    },
    async fetch() {
      const vm = this as any
      try {
        vm.$store.commit('post/SET_INITIAL_FORM')
        vm.$store.commit('post/CLEAR_FORM_ERROR')
        await vm.$store.dispatch('post-create/FETCH_DATA', {
          isGroupPage: true
        })
      } catch (e) {
        throw e
      }
    },
    data() {
      return {
        searchGroup: '',
        searchHashtag: '',
        hashtagsData: {
          data: []
        },
        searchLoading: false
      }
    },
    watch: {
      searchGroup(v) {
        this.fetchGroupSearch(v)
      },
      searchHashtag(v) {
        this.fetchSearch(v, Api.new.SEARCH_HASHTAG, 'hashtagsData')
      }
    },
    computed: {
      ...mapState('post', ['form', 'post_page', 'errors']),
      ...mapGetters('post-create', [
        'getNoSub',
        'getSub',
        'getCateg',
        'getLoad'
      ]),
      ...mapGetters('post', ['isTagExist', 'replaceTagExist'])
    },
    methods: {
      /**
       * Handlers - start
       */
      groupHandler(v: any) {
        const vm = this as any
        vm.$store.commit('post/CLEAR_FORM_ERROR')
        vm.$store.commit('post/HANDLE_FORM_INPUT', {
          name: 'topic_id',
          value: v.topic.id
        })
        vm.$store.commit('post/HANDLE_FORM_INPUT', {
          name: 'group_id',
          value: v.id
        })
        vm.$store.commit('post-create/SET_CATEGORY_DATA', v.categories)
      },
      categoryHandler(v: any) {
        const vm = this as any
        vm.$store.commit('post/CLEAR_FORM_ERROR')
        vm.$store.commit(`post/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: 'category_id',
          value: v.id
        })
      },
      imageHandler(value: any) {
        const vm = this as any
        vm.imageData = value
        vm.$store.commit(`post/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: 'logo',
          value
        })
      },
      hashtagHandler(v: any) {
        this.searchHashtag = v.target.value
      },
      deleteHandler(e: any) {
        const checkValueLength: boolean = e.target.value.length === 0
        const hashtagsLength: number = this.form.hashtags.length - 1
        if (checkValueLength)
          this.DELETE_LAST_HASHTAG({ value: hashtagsLength, obj: 'form' })
      },
      inputHandler(e: any, { key = 'value' }: any = {}) {
        const vm = this as any
        vm._slugGenerate(e, { store: true })
        vm._handleStorePost(e, { key })
      },
      /**
       * Handlers - finish
       */
      fetchSearch: debounce(async function(
        this: any,
        search: string = '',
        url: any,
        dataArg: any
      ) {
        // @ts-ignore
        const vm = this
        const s = { params: { search } }
        const { data } = await vm.$axios.get(url, s)
        vm[dataArg].data = data
      },
      Number(process.env.REQUEST_DEBOUNCE)),
      fetchGroupSearch: debounce(async function(this: any, search = '') {
        const vm = this
        vm.searchLoading = true
        await vm.$store.dispatch('post-create/FETCH_GROUPS', { search })
        setTimeout(() => {
          vm.searchLoading = false
        }, 150)
      }, Number(process.env.REQUEST_DEBOUNCE)),
      search(v: any) {
        this.searchGroup = v.target.value
      },
      store() {
        const vm = this as any
        vm._store()
      },
      hashtagSelect(v: any) {
        const vm = this as any
        if (vm.isTagExist({ value: v || vm.searchHashtag, obj: 'form' })) return
        if (v.charAt(0) === '#') {
          vm.$store.commit(`post/${MutationsList.PUSH_HASHTAG_NAME}`, {
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
          vm.$store.commit(`post/${MutationsList.PUSH_HASHTAG_NAME}`, {
            value: `#${v}`,
            obj: 'form'
          })
          vm.searchHashtag = ''
        }
      },
      async getHashtags() {
        const vm = this as any
        const { data } = await vm.$axios.get(Api.new.SEARCH_HASHTAG, '')
        vm.hashtagsData.data = data
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.post-create-admin {
  margin: 30px 0;
  display: flex;
  flex-direction: column;

  .select {
    &:first-child {
      margin-bottom: 30px;
    }
  }
}

/deep/ {
  .controll {
    min-width: 24px;
  }

  .hint {
    white-space: initial;
  }
}
</style>
