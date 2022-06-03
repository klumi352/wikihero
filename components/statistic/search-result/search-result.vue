<template>
  <div>
    <br />
    <br />
    <h3>{{ $t('stat.module-search-result') }}</h3>
    <v-table
      no-search
      no-pagination
      :columns="columns"
      :rows="rows"
      :options="options"
    >
    </v-table>
  </div>
</template>

<script lang="ts">
/**
 * ALL METHODS IS THERE
 */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'

export default AdminMixins({
  getPath: Api.admin.STATISTIC_SEARCH
}).extend({
  mounted() {
    this.refresh()
  },
  data() {
    const vm = this as any
    return {
      loading: false,
      columns: [
        {
          label: vm.$t('stat.search-result-total'),
          field: 'total',
          sortable: false
        },
        {
          label: vm.$t('stat.search-result-result'),
          field: 'success_result',
          sortable: false
        },
        {
          label: vm.$t('stat.search-result-no-result'),
          field: 'no_result',
          sortable: false
        },
        {
          label: vm.$t('stat.search-result-unsuccess'),
          field: 'un_success_result',
          sortable: false
        }
      ]
    }
  }
})
</script>
