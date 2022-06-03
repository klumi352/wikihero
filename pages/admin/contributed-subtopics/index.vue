<template>
  <div>
    <h1>{{ $t('global.subtopics') }}</h1>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      :row-style-class="(r) => computeRowStyle(r)"
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
        <button
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="
            slugSetting(data.row.slug)
            $refs.modalEdit.open()
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.confirm')"
          class="g-t-btn g-t-btn--svg-grey g-t-btn--svg-success-hover"
          :disabled="data.row.confirmed === 1"
          :class="{
            'g-t-btn--svg-success': data.row.confirmed === 1
          }"
          @click="
            $store
              .dispatch('topic/changeConfirm', {
                id: data.row.id,
                confirm: true
              })
              .then(refresh)
          "
        >
          <icon-publish width="20" height="20" />
        </button>
        <button
          :title="$t('admin.disconfirm')"
          class="g-t-btn g-t-btn--svg-grey g-t-btn--svg-error-hover"
          :disabled="data.row.confirmed === 0"
          :class="{ 'g-t-btn--svg-error': data.row.confirmed === 0 }"
          @click="
            $store
              .dispatch('topic/changeConfirm', {
                id: data.row.id,
                confirm: false
              })
              .then(refresh)
          "
        >
          <icon-lock width="20" height="20" />
        </button>

        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store.dispatch('topic/delete', { id: data.row.id }).then(refresh)
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
    <!-- -->
    <!-- @@@ Modal edit -->
    <modal-view
      key="edit-index"
      ref="modalEdit"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-index"
    >
      <div v-if="isOpen">
        <edit-index
          :slug="currentSlug"
          @edited="
            $refs.modalEdit.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- --- -->
    <admin-modal :columns="columns" />
  </div>
</template>

<script lang="ts">
import { Api } from '@/api.config'
import AdminModal from '@/components/admin/admin-modal/admin-modal.vue'
/**
 * ALL METHODS IS THERE
 */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'

export default AdminMixins({
  getPath: Api.admin.SUBTOPIC_CONTRIBUTED_ALL
}).extend({
  components: {
    AdminModal
  },
  data() {
    const vm = this as any
    return {
      columns: [
        {
          label: '',
          field: 'custom-field',
          width: '50px',
          sortable: false
        },
        { label: vm.$t('table.id'), field: 'id', sortable: false },
        {
          label: vm.$t('table.name'),
          field: 'name',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.parent'),
          field: 'parent_topic.name',
          sortable: false
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
        { label: vm.$t('table.reason'), field: 'reason', sortable: false },
        {
          label: vm.$t('table.email'),
          field: 'email',
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '141px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    computeRowStyle(r: any) {
      if (r.is_new) return 'g-highlight-row'
      if (r.confirmed === 0) return 'g-highlight-error-row'
    }
  }
})
</script>

<style lang="scss"></style>
