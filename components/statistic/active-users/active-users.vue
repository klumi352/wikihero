<template>
  <div>
    <h3>{{ $t('stat.module-active-user') }}</h3>
    <div class="a-mw400px">
      <v-select
        :placeholder="$t('stat.select-period')"
        :options="[30, 60, 90, 120, 150]"
        @input="(ev) => refresh({ perDay: ev })"
      />
    </div>
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
  getPath: Api.admin.STATISTIC_ACTIVE_USER
}).extend({
  mounted() {
    this.refresh({ perDay: 30 })
  },
  data() {
    const vm = this as any
    return {
      loading: false,
      columns: [
        {
          label: vm.$t('stat.count-active-users'),
          field: 'count_active_users',
          sortable: false
        }
      ]
    }
  }
})
</script>
