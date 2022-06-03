<template>
  <div>
    <h1>{{ $t('global.links') }}</h1>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      :row-style-class="(r) => (r.is_new ? 'g-highlight-row' : '')"
      @change="change"
    >
      <template v-slot:custom-field="{ data }">
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
      <template v-slot:actions="{ data }">
        <a
          target="_blank"
          :href="`${data.row.url}`"
          :title="$t('admin.open')"
          class="g-t-btn"
        >
          <icon-open width="20" height="20" />
        </a>
        <button
          :title="$t('admin.publish')"
          class="g-t-btn g-btn--publish"
          :class="{ active: !!data.row.confirmed }"
          @click="changeStatus({ id: data.row.id })"
        >
          <icon-publish width="20" height="20" />
        </button>
        <button class="g-t-btn" @click="del({ id: data.row.id })">
          <icon-delete width="20" height="20" />
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

export default AdminMixins({ getPath: Api.admin.LINK_SUGGESTED }).extend({
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
          field: 'custom-field',
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
        {
          label: vm.$t('table.title'),
          field: 'content.title',
          sortable: false
        },
        {
          label: vm.$t('table.description'),
          field: 'content.description',
          sortable: false
        },
        {
          label: vm.$t('table.image'),
          width: '100px',
          field: ({ content }: any) =>
            `<div class="a-flex-center"><img class="g-table-image" src="${content.image ||
              vm.$t('$i.empty-link-resource.url')}"/></div>`,
          html: true,
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '105px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    del({ id }: any) {
      const vm = this as any
      if (!confirm(vm.$t('modal.are-you-sure'))) return

      vm.loading = true
      return this.$axios
        .delete(Api.admin.LINK_SUGGESTED_DELETE(id))
        .then(
          () => {
            vm.$notification.success('delete')
            vm.refresh()
          },
          () => {
            vm.$notification.error('smth')
          }
        )
        .finally(() => {
          vm.loading = false
        })
    },
    changeStatus({ id }: any) {
      const vm = this
      vm.loading = true
      return this.$axios
        .put(Api.admin.LINK_SUGGESTED_CHANGE_STATUS(id))
        .then(
          () => {
            vm.$notification.success('update')
            vm.refresh()
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
