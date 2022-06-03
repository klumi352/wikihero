import { SearchMixin } from '~/plugins/vue-extend/mixins/-search-mixin'

export const SearchResultItemMixin = () =>
  SearchMixin().extend({
    props: {
      item: Object
    },
    methods: {
      putHighlight(text: string): String {
        return text
      }
    }
  })
