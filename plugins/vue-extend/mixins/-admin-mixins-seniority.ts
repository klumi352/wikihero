/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState } from 'vuex'
import { MutationsList, ActionsList } from '@/store/seniority'

export const AdminMixins = () =>
  Vue.extend({
    middleware: 'only-auth',
    data() {
      return {
        loading: false
      }
    },
    computed: {
      ...mapState('seniority', ['form', 'seniority'])
    },
    methods: {
      _handleStoreSeniority(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`seniority/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
      },
      _handleEditSeniority(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(
          `seniority/${MutationsList.HANDLE_SENIORITY_INPUT}`,
          {
            name: e.target.name,
            value: e.target[key]
          }
        )
      },
      _store() {
        this.loading = true
        this.$store
          .dispatch(`seniority/${ActionsList.STORE}`)
          .then(() => {
            this.$emit('stored')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _put() {
        this.loading = true
        this.$store
          .dispatch(`seniority/${ActionsList.PUT}`)
          .then(() => {
            this.$emit('edited')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      }
    }
  })
