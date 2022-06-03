<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <Photoloader
            :image-url="post.logo"
            :disable-mod="!checkUserStatus"
            @upload="imageHandler"
          ></Photoloader>
          <div class="post-create-admin">
            <PostSelect
              :name="'group_id'"
              :follow-data="followData"
              :list-data="groupsData"
              :search-input="searchGroup"
              :store-value="post.group_id"
              admin-use
              :select-title="getTitleGroup"
              :second-name="'topic_id'"
              :second-store-value="post.topic_id"
              :error="errors.group_id"
              @select="groupHandler"
              @input="search"
            />
            <PostSelectCheckbox
              :name="'category_id'"
              :select-title="getTitleCategory"
              :list-data="categoriesData"
              :store-value="post.category_id"
              :error="errors.category_id"
              admin-use
              edit-mode
              @check="categoryHandler"
            />
          </div>
          <PostSelectSearchForHashtag
            :input-value="searchHashtag"
            :hashtags-list="hashtagsData"
            :store-value="post.hashtags"
            admin-use
            :state-obj="'post'"
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
            :value="post.slug"
            @input="inputHandler"
            @keypress.enter="store"
          />
          <v-input
            name="title"
            :placeholder="$t('table.name')"
            :error="errors.title"
            :value="post.title"
            @input="inputHandler"
            @keypress.enter="store"
          />
          <v-quill
            with-toolbar
            :placeholder="$t('table.description')"
            :value="post.description"
            :error="errors.description"
            name="description"
            @input="inputHandler"
          />
          <v-select
            :placeholder="
              post.author_data
                ? post.author_data.email
                : $t('modal-tip.user-search')
            "
            :options="usersData.data"
            label="email"
            name="user_id"
            @input="
              (e) => inputHandler({ target: { name: 'user_id', value: e.id } })
            "
            @search="(e) => fetchSearch(e, '/admin/users', 'usersData')"
          />
          <div v-if="checkUserStatus">
            <v-controll
              type="checkbox"
              name="is_anonymous"
              :checked="post.is_anonymous"
              :hint="$t('post.admin-warning')"
              @input="inputHandler($event, { key: 'checked' })"
            />
            <v-input
              v-if="!post.is_anonymous"
              :value="post.first_name"
              name="first_name"
              :placeholder="'Name'"
              @input="inputHandler"
            />
            <v-input
              v-if="!post.is_anonymous"
              :value="post.last_name"
              name="last_name"
              :placeholder="'Surname'"
              @input="inputHandler"
            />
            <v-input
              :value="post.job_title"
              name="job_title"
              :placeholder="'Job title'"
              @input="inputHandler"
            />
            <v-input
              v-if="!post.is_anonymous"
              :value="post.email"
              name="email"
              type="email"
              :placeholder="'Email'"
              @input="inputHandler"
            />
          </div>
          <div v-else>
            <v-controll
              type="checkbox"
              name="is_anonymous"
              :checked="post.is_anonymous"
              :hint="$t('post.admin-warning')"
              @input="inputHandler($event, { key: 'checked' })"
            />
            <v-input
              :value="post.first_name"
              name="first_name"
              :placeholder="'Name'"
              :disabled="!checkUserStatus"
              @input="inputHandler"
            />
            <v-input
              :value="post.last_name"
              name="last_name"
              :placeholder="'Surname'"
              :disabled="!checkUserStatus"
              @input="inputHandler"
            />
            <v-input
              name="job_title"
              :placeholder="'Job title'"
              :disabled="!checkUserStatus"
              @input="inputHandler"
            />
            <v-input
              :value="post.email"
              name="email"
              type="email"
              :placeholder="'Email'"
              :disabled="!checkUserStatus"
              @input="inputHandler"
            />
          </div>
          <seo-module
            :errors="{}"
            :data="{
              meta_title: post.meta_title,
              meta_description: post.meta_description,
              meta_keywords: post.meta_keywords
            }"
            @was-keypress="put"
            @input="inputHandler"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.edit') }}</h1>
          <h3>
            <b>{{ $t('admin.edit-post') }}</b> {{ $t('global.topic') }}
          </h3>
          <fetch-loading class="top" :class="{ loading }">
            <button :disabled="loading" class="g-btn" @click="put">
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
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
import debounce from 'lodash/debounce'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-post'
import { MutationsList } from '@/store/post'
import { Api } from '@/api.config'
import Photoloader from '@/chunk/forms/v-photoloader/v-photoloader.vue'
import PostSelect from '@/chunk/forms/v-post-select/v-post-select.vue'
import PostSelectCheckbox from '@/chunk/forms/v-select-checkbox/v-select-checkbox.vue'
import PostSelectSearchForHashtag from '@/chunk/forms/v-select-search-for-hashtag/v-select-search-for-hashtag.vue'
export default AdminMixins({ compareRoute: 'topic-group-post-@edit' }).extend({
  components: {
    Photoloader,
    PostSelect,
    PostSelectCheckbox,
    PostSelectSearchForHashtag
  },
  data() {
    return {
      groupsData: {
        data: []
      },
      categoriesData: {
        data: []
      },
      followData: {
        data: []
      },
      usersData: {
        data: []
      },
      hashtagsData: {
        data: []
      },
      searchGroup: '',
      searchHashtag: ''
    }
  },
  async created() {
    const vm = this as any
    try {
      vm.groupsData.data = (
        await vm.$axios.get(Api.new.GET_ALL_GROUPS_ADMIN)
      ).data.map((group: any) => ({
        ...group,
        isSelected: false
      }))
      vm.followData.data = (
        await vm.$axios.get(Api.new.SUBSCRIBED_GROUPS)
      ).data.map((group: any) => ({
        ...group,
        isSelected: false
      }))
      vm.categoriesData.data = (
        await vm.$axios.get(Api.new.GET_ALL_CATEGORIES_ADMIN)
      ).data.map((category: any) => ({
        ...category,
        isChecked: false
      }))
    } catch (e) {
      throw e
    }
    if (this.post.group_id !== null)
      this.getCategoriesByGroupId(this.post.group_id)
  },
  async fetch({ store, error, route, $axios, params }) {
    try {
      if (route.name === 'topic-group-post-@edit') {
        await store.dispatch('post/FIND_POST_BYSLUG', { slug: params.post })
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  watch: {
    searchGroup(v) {
      const vm = this as any
      vm.fetchSearch(v, Api.new.GET_ALL_GROUPS, 'groupsData')
    },
    searchHashtag(v) {
      const vm = this as any
      vm.fetchSearch(v, Api.new.SEARCH_HASHTAG, 'hashtagsData')
    }
  },
  computed: {
    ...mapState('post', ['post', 'errors']),
    ...mapGetters('post', ['isTagExist', 'replaceTagExist']),
    checkUserStatus() {
      return this.post?.author_id === null
    },
    getTitleGroup() {
      return this.post?.group_data?.title
    },
    getTitleCategory() {
      return this.post?.category_data?.title
    }
  },
  mounted() {
    const vm = this as any
    vm.fetchSearch('', Api.admin.USER_ALL, 'usersData')
  },
  methods: {
    /**
     * Handlers - start
     */
    groupHandler(v: any) {
      const vm = this as any
      if ('sec_name' in v && 'sec_value' in v) {
        vm.$store.commit(`post/${MutationsList.HANDLE_POST_INPUT}`, {
          name: v.sec_name,
          value: v.sec_value
        })
      }
      vm.$store.commit(`post/${MutationsList.HANDLE_POST_INPUT}`, {
        name: v.name,
        value: v.value
      })
      vm.getCategoriesByGroupId(v.value)
    },
    categoryHandler(v: any) {
      const vm = this as any
      vm.$store.commit(`post/${MutationsList.HANDLE_POST_INPUT}`, {
        name: v.name,
        value: v.value
      })
    },
    imageHandler(value: any) {
      const vm = this as any
      vm.imageData = value
      vm.$store.commit(`post/${MutationsList.HANDLE_POST_INPUT}`, {
        name: 'logo',
        value
      })
    },
    inputHandler(e: any, { key = 'value' }: any = {}) {
      const vm = this as any
      vm._slugGenerate(e, { store: true })
      vm._handleEditPost(e, { key })
    },
    hashtagHandler(v: any) {
      const vm = this as any
      vm.searchHashtag = v.target.value
    },
    deleteHandler(e: any) {
      const checkValueLength: boolean = e.target.value.length === 0
      const hashtagsLength: number = this.post.hashtags.length - 1
      if (checkValueLength)
        this.DELETE_LAST_HASHTAG({ value: hashtagsLength, obj: 'post' })
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
      const vm = this
      const s = { params: { search } }
      const { data } = await vm.$axios.get(url, s)
      vm[dataArg].data = data
    },
    Number(process.env.REQUEST_DEBOUNCE)),
    search(v: any) {
      const vm = this as any
      vm.searchGroup = v.target.value
    },
    put() {
      const vm = this as any
      vm._put()
    },
    hashtagSelect(v: any) {
      const vm = this as any
      if (vm.isTagExist({ value: v || vm.searchHashtag, obj: 'post' })) return
      if (v.charAt(0) === '#') {
        vm.$store.commit(`post/${MutationsList.PUSH_HASHTAG_NAME}`, {
          value: v,
          obj: 'post'
        })
        vm.searchHashtag = ''
        return
      }
      if (
        vm.searchHashtag.charAt(0) !== '#' &&
        !vm.replaceTagExist({ value: v || vm.searchHashtag, obj: 'post' })
      ) {
        vm.$store.commit(`post/${MutationsList.PUSH_HASHTAG_NAME}`, {
          value: `#${v}`,
          obj: 'post'
        })
        vm.searchHashtag = ''
      }
    }
  }
})
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
</style>
