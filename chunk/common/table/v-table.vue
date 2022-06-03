<template>
  <div class="v-table" :class="{ noTextShorter }">
    <div v-if="options.default.totalRows" class="total-wrap">
      <span class="total">{{ options.default.totalRows }}</span>
    </div>
    <vue-good-table
      ref="tb"
      mode="remote"
      :line-numbers="false"
      :total-rows="options.default.totalRows"
      :columns="columns"
      :search-options="searchOptionsComputed"
      :pagination-options="paginationOptionsComputed"
      :row-style-class="rowStyleClass"
      :rows="rows"
      @on-search="onSearch"
      @on-sort-change="onSortChange"
      @on-page-change="changePage"
      @on-per-page-change="changePerPage"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'actions'">
          <div class="actions">
            <slot :data="props" name="actions" />
          </div>
        </span>
        <span v-else-if="props.column.field == 'custom-field'">
          <div class="custom-field">
            <slot :data="props" name="custom-field" />
          </div>
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
// @ts-ignore
import { VueGoodTable } from 'vue-good-table'
export default Vue.extend({
  name: 'VTable',
  components: {
    VueGoodTable
  },
  props: {
    // Options from parent controller
    noTextShorter: Boolean,
    noPagination: Boolean,
    noSearch: Boolean,
    rowStyleClass: Function,
    options: {
      type: Object,
      default: () => ({
        default: {},
        pagination: {},
        search: {}
      })
    },
    rows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const vm = this as any
    return {
      // @@@
      perPage: process.env.TABLE_PER_PAGE,
      page: 1,
      sort_field: null,
      sort_type: null,
      search: null,
      // @@@
      searchOption: {
        enabled: !vm.noSearch,
        trigger: 'enter',
        skipDiacritics: true,
        placeholder: vm.$t('table.search-result-placeholder')
      },
      paginationOption: {
        enabled: !vm.noPagination,
        mode: 'pages',
        perPage: process.env.TABLE_PER_PAGE,
        position: 'top',
        perPageDropdown: process.env.TABLE_PER_PAGE_VARIANTS?.split(',')?.map(
          Number
        ) || [15, 50],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: vm.$t('table.per-page'),
        ofLabel: '/',
        pageLabel: 'page',
        allLabel: 'All'
      }
    }
  },
  computed: {
    searchOptionsComputed() {
      const vm = this
      return cloneDeep({ ...vm.searchOption, ...(vm.options.search || {}) })
    },
    paginationOptionsComputed() {
      const vm = this
      return cloneDeep({
        ...vm.paginationOption,
        ...(vm.options.pagination || {})
      })
    }
  },
  methods: {
    emit(): any {
      const vm = this as any
      this.$emit('change', {
        per_page: vm.perPage,
        page: vm.page,
        field: vm.sort_field,
        type: vm.sort_type,
        search: vm.search || null
      })
    },
    onSearch(opt: any): void {
      const vm = this as any
      const { searchTerm } = opt
      vm.page = 1
      vm.search = searchTerm
      return vm.emit()
    },
    onSortChange(opt: any[]): void {
      const vm = this as any
      const [sort] = opt
      vm.sort_field = sort.field
      vm.sort_type = sort.type
      vm.page = 1
      return vm.emit()
    },
    changePerPage(opt: any): void {
      const vm = this as any
      vm.perPage = opt.currentPerPage
      vm.page = 1
      return vm.emit()
    },
    changePage(opt: any): void {
      const vm = this as any
      vm.perPage = opt.currentPerPage
      vm.page = opt.currentPage
      return vm.emit()
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-table';
</style>
