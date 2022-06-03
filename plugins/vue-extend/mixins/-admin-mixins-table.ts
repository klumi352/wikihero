import Vue from 'vue'
import isEmpty from 'lodash/isEmpty'
let lastQ: any

interface MixinProp {
  getPath?: string
}

export const AdminMixins = ({ getPath }: MixinProp = {}) =>
  Vue.extend({
    async asyncData({ $axios, query }) {
      const r: any = await $axios.get(`${getPath}`, {
        params: isEmpty(query)
          ? {
              perPage: process.env.TABLE_PER_PAGE
            }
          : query
      })
      return {
        protectRows: Array.isArray(r.data) ? r.data : [r.data],
        links: r.links,
        meta: r.meta
      }
    },
    data() {
      return {
        protectRows: undefined,
        links: undefined,
        meta: undefined,
        options: {
          default: {},
          pagination: {},
          search: {}
        } as any,
        currentSlug: null
      }
    },
    computed: {
      rows() {
        const vm = this as any
        const fn = vm.filterFunction ? vm.filterFunction : (v: any) => v
        return fn(vm.protectRows?.filter(Boolean))
      }
    },
    destroyed() {
      lastQ = null
    },
    created() {
      const vm = this as any
      vm.options.default.totalRows = vm.meta?.total
    },
    methods: {
      change(query = lastQ || {}) {
        const vm = this as any
        lastQ = query
        return vm.$options
          .asyncData({
            $axios: vm.$axios,
            query
          })
          .then(({ protectRows, meta }: any) => {
            vm.protectRows = protectRows
            vm.options.default.totalRows = meta?.total
          })
      },
      slugSetting(value: any) {
        this.currentSlug = value
      },
      refresh(q: any) {
        const vm = this as any
        return vm.change(q)
      }
    }
  })
