/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState } from 'vuex'
import { MutationsList, ActionsList } from '@/store/hashtag'

export const AdminMixins = () =>
  Vue.extend({
    middleware: 'only-auth',
    data() {
      return {
        loading: false
      }
    },
    computed: {
      ...mapState('hashtag', ['form', 'hashtag'])
    },
    methods: {
      _handleStoreHashtag(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`hashtag/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _handleEditHashtag(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`hashtag/${MutationsList.HANDLE_HASHTAG_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _store() {
        this.loading = true
        this.$store
          .dispatch(`hashtag/${ActionsList.STORE}`)
          .then(() => {
            this.$emit('stored')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _put() {
        this.loading = true
        this.$store
          .dispatch(`hashtag/${ActionsList.PUT}`)
          .then(() => {
            this.$emit('edited')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      }
    }
  })
