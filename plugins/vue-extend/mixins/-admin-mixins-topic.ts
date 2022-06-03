/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mt } from '@/store/topic'
import { slugify } from '@/helpers/slugify'
import SeoModule from '@/components/admin/seo-module/seo-module.vue'
import { transformKey } from '@/helpers'
import { MutationsList, ActionsList } from '@/store/group'

const transformer = transformKey([['tip_grouping', Number]])

interface MixinParams {
  compareRoute?: string
}

interface MixinProp {
  redirect?: string
  params?: { topic?: string; group?: string; _force?: string }
}

interface FindParams {
  group_id: number
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
    computed: {},
    methods: {
      async _findGroup({ group_id }: FindParams) {
        const trigger = this.routeName === compareRoute
        try {
          if (trigger) {
            await this.$store.dispatch('group/FIND', { slug: group_id })
          }
        } catch (e) {
          throw e
        }
      },
      _slugGenerateGroup(e: any, { store = false, edit = false }: any = {}) {
        if (e.target.name === 'title') {
          store &&
            this._handleStoreGroup({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
          edit &&
            this._handleEditGroup({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
        }
      },
      _handleStoreGroup(e: any, { key = 'value' }: any = {}) {
        this.$store.commit(`group/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
        this.$store.commit(`group/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
      },
      _handleEditGroup(e: any, { key = 'value' }: any = {}) {
        this.$store.commit(`group/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
        this.$store.commit(`group/${MutationsList.HANDLE_GROUP_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _store({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch(`group/${ActionsList.STORE}`, { trigger, redirect })
          .then(() => {
            this.$emit('stored')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _storeTopic({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch('topic/store', { trigger, redirect })
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
          .dispatch(`group/${ActionsList.PUT}`, { trigger, redirect })
          .then(() => {
            this.$emit('edited')
            this.$store.dispatch('ui/boot')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _putTopic({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch('topic/put', { trigger, redirect })
          .then(() => {
            this.$emit('edited')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _slugGenerate(e: any, { store = false, edit = false }: any = {}) {
        if (e.target.name === 'name') {
          store &&
            this._handleStoreTopic({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
          edit &&
            this._handleEditTopic({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
        }
      },
      _forceFetch({ params }: MixinProp) {
        const vm = this as any
        ;(vm as any).$options.fetch({
          store: vm.$store,
          params
        })
      },
      _destroy() {
        if (this.routeName !== compareRoute) {
          this.$store.commit(`topic/${mt.SET_INITIAL_TOPIC}`)
        }
        this.$store.commit(`topic/${mt.CLEAR_FORM_ERROR}`)
      },
      _reorder({ redirect }: MixinProp = {}) {
        const trigger = this.routeName === compareRoute
        this.loading = true
        this.$store
          .dispatch('topic/reorder', { trigger, redirect })
          .then(() => {
            this.$emit('edited')
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => (this.loading = false))
      },
      _handleStoreTopic(e: any, { key = 'value' }: any = {}) {
        this.$store.commit(`topic/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
        this.$store.commit(`topic/${mt.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _handleEditTopic(e: any, { key = 'value' }: any = {}) {
        this.$store.commit(`topic/${mt.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
        this.$store.commit(`topic/${mt.HANDLE_TOPIC_INPUT}`, {
          name: e.target.name,
          value: transformer(e.target[key], e.target.name)
        })
      },
      storeImageHandler(value: any, { type }: any) {
        const vm = this as any
        vm.imageData = value
        vm.$store.commit(`group/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: type,
          value: vm.imageData
        })
      },
      editImageHandler(value: any, { type }: any) {
        const vm = this as any
        vm.imageData = value
        vm.$store.commit(`group/${MutationsList.HANDLE_GROUP_INPUT}`, {
          name: type,
          value
        })
      }
    }
  })
