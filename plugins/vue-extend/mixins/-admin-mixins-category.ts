import Vue from 'vue'
import { mapState } from 'vuex'
import { MutationsList, ActionsList } from '@/store/category'
import { slugify } from '@/helpers/slugify'

export const AdminMixins = () =>
  Vue.extend({
    middleware: 'only-auth',
    components: {},
    data() {
      return {
        loading: false,
        routeName: this.$route.name
      }
    },
    computed: {
      ...mapState('category', ['form', 'category'])
    },
    methods: {
      _slugGenerate(e: any, { store = false, edit = false }: any = {}) {
        if (e.target.name === 'title') {
          store &&
            this._handleStoreCategory({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
          edit &&
            this._handleEditCategory({
              target: {
                name: 'slug',
                value: slugify(e.target.value)
              }
            })
        }
      },
      _handleStoreCategory(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`category/${MutationsList.HANDLE_FORM_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
        /** clear errors */
        this.$store.commit(`category/${MutationsList.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
      },
      _handleEditCategory(e: any, { key = 'value' }: any = {}) {
        /** set to store */
        this.$store.commit(`category/${MutationsList.HANDLE_CATEGORY_INPUT}`, {
          name: e.target.name,
          value: e.target[key]
        })
        /** clear errors */
        this.$store.commit(`category/${MutationsList.SET_FORM_ERROR}`, {
          [e.target.name]: ''
        })
      },
      _store() {
        this.loading = true
        this.$store
          .dispatch(`category/${ActionsList.STORE}`)
          .then(() => {
            this.$emit('stored')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      },
      _put() {
        this.loading = true
        this.$store
          .dispatch(`category/${ActionsList.PUT}`)
          .then(() => {
            this.$emit('edited')
          })
          .catch(() => {})
          .finally(() => (this.loading = false))
      }
    }
  })
