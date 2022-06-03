<template>
  <div>
    <br />
    <br />
    <h3>{{ $t('stat.module-validate') }}</h3>
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
  getPath: Api.admin.STATISTIC_VALIDATED_TIP
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
          label: vm.$t('stat.count-validated-tips-by-temps-users'),
          field: 'count_validated_tips_by_temps_users',
          sortable: false
        },
        {
          label: vm.$t('stat.count-validated-tips-by-register-users'),
          field: 'count_validated_tips_by_register_users',
          sortable: false
        },
        {
          label: vm.$t('stat.total-count-validated'),
          field: 'total_count',
          sortable: false
        },
        {
          label: vm.$t('stat.temp-users-to-all-users'),
          field: 'temp_users_to_all_users',
          sortable: false
        },
        {
          label: vm.$t('stat.users-to-all-users'),
          field: 'users_to_all_users',
          sortable: false
        }
      ]
    }
  }
})
</script>
