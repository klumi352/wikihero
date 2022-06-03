<template>
  <div>
    <h1>{{ $t('global.levels') }}</h1>
    <!-- Create btn -->
    <button
      :title="$t('admin.create-level')"
      class="g-btn g-btn--link"
      @click="createSeniority"
    >
      <icon-plus width="12" height="12" />&nbsp;{{ $t('admin.create-level') }}
    </button>
    <!--  -->

    <!-- Admin table -->
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      @change="change"
    >
      <template v-slot:actions="{ data }">
        <button
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="editSeniority(data.row.id)"
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store
              .dispatch(`seniority/DELETE`, {
                id: data.row.id
              })
              .then(refresh)
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
    <!--  -->

    <!-- @@@ Modal create -->
    <modal-view
      key="create-seniority"
      ref="modalCreateSeniority"
      v-slot="{ isOpen }"
      extra-wide
      name="create-seniority"
      no-overflow
    >
      <div v-if="isOpen">
        <CreateSeniorityModal
          @stored="
            $refs.modalCreateSeniority.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->

    <!-- @@@ Modal edit -->
    <modal-view
      key="edit-seniority"
      ref="modalEditSeniority"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-seniority"
      no-overflow
    >
      <div v-if="isOpen">
        <EditSeniorityModal
          @edited="
            $refs.modalEditSeniority.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable vue/no-unused-vars */
import Vue from 'vue'
import CreateSeniorityModal from '@/components/admin/admin-seniority-modal/admin-seniority-create.vue'
import EditSeniorityModal from '@/components/admin/admin-seniority-modal/admin-seniority-edit.vue'

import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { ActionsList, MutationsList } from '~/store/seniority'

export default AdminMixins({
  getPath: Api.admin.SENIORITIES_ALL
}).extend({
  components: {
    CreateSeniorityModal,
    EditSeniorityModal
  },
  filters: {},
  data() {
    const vm = this as any
    return {
      currMode: '',
      groups: [],
      columns: [
        { label: vm.$t('table.id'), field: 'id', sortable: false },
        {
          label: vm.$t('table.name'),
          field: 'name',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '218px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    createSeniority() {
      this.$refs.modalCreateSeniority.open()
      this.$store.commit(`seniority/${MutationsList.SET_INITIAL_SENIORITY}`)
    },
    async editSeniority(v: number) {
      await this.$store.dispatch(`seniority/FIND`, {
        slug: v,
        isAdmin: true
      })
      this.$refs.modalEditSeniority.open()
    }
  }
})
</script>
