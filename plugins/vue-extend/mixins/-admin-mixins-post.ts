/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { mt } from '@/store/topic'
import { slugify } from '@/helpers/slugify'
// @ts-ignore
import SeoModule from '@/components/admin/seo-module/seo-module.vue'
import { MutationsList, ActionsList } from '@/store/post'
import { Api } from '@/api.config'

interface MixinParams {
  compareRoute?: string
}

interface MixinProp {
  redirect?: string
  params?: { post?: string; _force?: string }
}

export const AdminMixins = ({ compareRoute }: MixinParams) =>
  Vue.extend({
    middleware: 'only-auth',
    components: {
      SeoModule
    },
    props: {
      slug: [String, Number]
    },
    data() {
      return {
        loading: false,
        routeName: this.$route.name
      }
    },
    computed: {
      ...mapState('post', ['form', 'post', 'errors']),
      ...mapGetters('post', ['isTagExist'])
    },
    methods: {
      ...mapMutations('post', ['HANDLE_FORM_INPUT', 'DELETE_LAST_HASHTAG']),
      /** Post */
      _slugGenerate(e: any, { store = false, edit = false }: any = {}) {
        if (e.target.name === 'title') {
          store &&
            this._handleStorePost({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
          edit &&
            this._handleEditPost({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
        }
      },
      _handleStorePost(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`post/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
        /** clear errors */
        this.$store.commit(`post/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
      },
      _handleEditPost(e: any, { key = 'value' }: any = {}) {
        /** clear errors */
        this.$store.commit(`post/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
        /** set to store */
        this.$store.commit(`post/${MutationsList.HANDLE_POST_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _store({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch(`post/${ActionsList.CREATE_POST}`, { trigger, redirect })
          .then(() => {
            this.$emit('stored')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _put({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch(`post/${ActionsList.EDIT_POST}`, { trigger, redirect })
          .then(() => {
            this.$emit('edited')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      async getHashtags() {
        const vm = this as any
        const { data } = await vm.$axios.get(Api.new.SEARCH_HASHTAG, '')
        vm.hashtagsData.data = data
      },
      async getCategoriesByGroupId(id: number) {
        const vm = this as any
        try {
          vm.categoriesData.data = (
            await vm.$axios.get(Api.new.GET_ALL_CATEGORIES_BY_GROUP(id))
          ).data.map((category: any) => ({
            ...category,
            isChecked: false
          }))
        } catch (e) {
          throw e
        }
      }
    }
  })
