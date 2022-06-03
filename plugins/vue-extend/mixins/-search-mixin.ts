import Vue, { PropType } from 'vue'

type FilterType = {
  categories: Array<CategoryType>
  group: GroupType
  hashtags: Array<HashtagType>
  query: string
  type: Array<TypeType>
}

type GroupType = {
  value: number
}
type CategoryType = {
  id: number
}
type TypeType = {
  id: string
}
type HashtagType = {
  id: number
}

export const SearchMixin = () =>
  Vue.extend({
    props: {
      disabled: Boolean,
      filters: Object as PropType<FilterType>,
      resultCount: Number,
      metaData: Object
    },
    computed: {
      categoryIds(): Array<number> {
        return this.filters.categories.map(({ id }) => id)
      },
      groupValue(): number | null {
        return this.filters.group ? this.filters.group.value : null
      },
      groupId(): number | null {
        return this.groupValue && this.groupValue !== 0 ? this.groupValue : null
      },
      hashtagIds() {
        return this.filters.hashtags.map(({ id }) => id)
      },
      typeId(): Array<string> {
        return this.filters.type.map(({ id }) => id)
      }
    },
    methods: {
      prepareParams(
        page: number,
        sort: string | null = null,
        query: string | null
      ): Object {
        return {
          page,
          order_by: sort,
          q: query || this.filters.query,
          group_id: this.groupId,
          categories_id: this.categoryIds,
          hashtags_id: this.hashtagIds,
          per_page: process.env.SEARCH_PER_PAGE
        }
      },
      mergePaginatedData(
        page: number,
        newData: Array<Object>,
        oldData: Array<Object> = []
      ) {
        return page === 1 ? newData : [...oldData, ...newData]
      }
    }
  })
