<template>
  <div>
    <h1>{{ $t('global.tip-comments') }}</h1>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      :row-style-class="(r) => (r.is_new ? 'g-highlight-row' : '')"
      @change="change"
    >
      <template v-slot:actions="{ data }">
        <button
          class="g-t-btn"
          @click="
            $root.$emit('show-modal', {
              name: 'admin-modal',
              data: data.row
            })
          "
        >
          <icon-eye width="20" height="20" />
        </button>
      </template>
    </v-table>
    <!-- --- -->
    <admin-modal :columns="columns" />
  </div>
</template>

<script lang="ts">
/**
 * ALL METHODS IS THERE
 */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import AdminModal from '@/components/admin/admin-modal/admin-modal.vue'
import { Api } from '@/api.config'

export default AdminMixins({
  getPath: Api.admin.TIP_COMMENT_ALL
}).extend({
  components: {
    AdminModal
  },
  data() {
    const vm = this as any
    return {
      loading: false,
      columns: [
        {
          label: '',
          field: 'actions',
          width: '50px',
          sortable: false
        },
        { label: vm.$t('table.id'), field: 'id', sortable: false },
        {
          label: vm.$t('global.tip'),
          html: true,
          field: ({ tip }: any) =>
            tip
              ? `<a target="_blank" class="g-link" href="/tip/${tip.id}">${tip.name}</a>`
              : '',
          width: '100px',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.user'),
          sortable: false,
          html: true,
          tdClass: ({ user }: any) =>
            // eslint-disable-next-line camelcase
            user?.temp_user || !user ? 'g-highlight-temp' : '',
          field: ({ user }: any) =>
            // eslint-disable-next-line camelcase
            user && !user?.temp_user ? `${user?.email} / ${user?.name}` : ''
        },
        { label: vm.$t('table.comment'), field: 'comment', sortable: false }
      ]
    }
  }
})
</script>

<style lang="scss"></style>
