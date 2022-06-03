<template>
  <div>
    <h1>{{ $t('global.users') }}</h1>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      @change="change"
    >
      <template v-slot:actions="{ data }">
        <button
          :title="$t('admin.publish')"
          class="g-t-btn"
          :disabled="loading"
          @click="ban({ id: data.row.id }).then(refresh)"
        >
          <icon-lock
            :class="{
              'g-svg-error': data.row.is_baned,
              'g-svg-green': !data.row.is_baned
            }"
            width="20"
            height="20"
          />
        </button>

        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          :disabled="loading"
          @click="del({ id: data.row.id }).then(refresh)"
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
  </div>
</template>

<script lang="ts">
/**
 * ALL METHODS IS THERE
 */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'

export default AdminMixins({ getPath: Api.admin.USER_ALL }).extend({
  data() {
    const vm = this as any
    return {
      loading: false,
      columns: [
        { label: vm.$t('table.id'), field: 'id', sortable: false },
        {
          label: vm.$t('table.name'),
          field: 'name',
          sortable: true,
          tdClass: 'g-highlight'
        },
        { label: vm.$t('table.email'), field: 'email', sortable: true },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '90px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    del({ id }: any) {
      const vm = this
      if (!confirm(vm.$t('modal.are-you-sure') as string))
        return Promise.resolve()

      vm.loading = true
      return this.$axios
        .delete(Api.admin.USER_DELETE(id))
        .then(
          () => {
            vm.$notification.success('delete')
          },
          () => {
            vm.$notification.error('smth')
          }
        )
        .finally(() => {
          vm.loading = false
        })
    },
    ban({ id }: any) {
      const vm = this
      vm.loading = true
      return this.$axios
        .put(Api.admin.USER_TO_BAN(id))
        .then(
          () => {
            vm.$notification.success('update')
          },
          () => {
            vm.$notification.error('smth')
          }
        )
        .finally(() => {
          vm.loading = false
        })
    }
  }
})
</script>

<style lang="scss"></style>
