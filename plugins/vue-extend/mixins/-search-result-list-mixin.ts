import { PropType } from 'vue'
import { SearchMixin } from '~/plugins/vue-extend/mixins/-search-mixin'

type PaginationType = {
  data: Array<Object>
  meta: Object
}

export const SearchResultListMixin = () =>
  SearchMixin().extend({
    props: {
      title: String,
      pagination: Object as PropType<PaginationType>
    },
    computed: {
      hasData(): boolean {
        return Boolean(
          this.pagination && this.pagination.data && this.pagination.data.length
        )
      }
    },
    methods: {
      handlePagination(data: { page: number }): void {
        this.$emit('change', data)
      }
    }
  })
