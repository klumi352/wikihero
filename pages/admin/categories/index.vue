<template>
  <div>
    <h1>{{ $t('global.categories') }}</h1>
    <!-- Create btn -->
    <button
      :title="translations.category"
      class="g-btn g-btn--link"
      @click="handleModal('create')"
    >
      <icon-plus width="12" height="12" />&nbsp;{{ translations.create }}
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
          @click="
            slugSetting(data.row.slug)
            editTemporaryHandle(data.row.id)
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store
              .dispatch('category/DELETE', { id: data.row.id })
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
      key="create-category"
      ref="modalCreateCategory"
      v-slot="{ isOpen }"
      extra-wide
      name="create-category"
      no-overflow
    >
      <div v-if="isOpen">
        <CreateCategoryModal
          :groups-list="groups"
          @stored="
            $refs.modalCreateCategory.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->

    <!-- @@@ Modal edit -->
    <modal-view
      key="edit-category"
      ref="modalEditCategory"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-category"
      no-overflow
    >
      <div v-if="isOpen">
        <EditCategoryModal
          :groups-list="groups"
          @edited="
            $refs.modalEditCategory.close()
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
import Vue from 'vue'
import CreateCategoryModal from '@/components/admin/admin-categories-modal/admin-category-create.vue'
import EditCategoryModal from '@/components/admin/admin-categories-modal/admin-category-edit.vue'

import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { ActionsList, MutationsList } from '~/store/category'

export default AdminMixins({
  getPath: Api.new.GET_ALL_CATEGORIES_ADMIN
}).extend({
  components: {
    CreateCategoryModal,
    EditCategoryModal
  },
  filters: {
    generateUrl(data: any) {
      return `/${data.row.category?.slug}/${data.row.slug}`
    }
  },
  data() {
    const vm = this as any
    return {
      translations: {
        category: 'category',
        create: 'create category'
      },
      currMode: '',
      groups: [],
      columns: [
        { label: vm.$t('table.id'), field: 'id', sortable: false },
        {
          label: vm.$t('table.name'),
          field: 'title',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.parent'),
          field: 'groups',
          sortable: false
        },
        {
          label: vm.$t('table.description'),
          field: 'description',
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '100px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    async handleModal($mode: string) {
      const vm = this
      switch ($mode) {
        case 'create':
          vm.currMode = 'modalCreateCategory'
          vm.$store.commit(`category/${MutationsList.CLEAR_FORM_ERROR}`)
          vm.$store.commit(`category/${MutationsList.SET_INITIAL_CATEGORY}`)
          break
        case 'edit':
          vm.currMode = 'modalEditCategory'
          vm.$store.commit(`category/${MutationsList.CLEAR_FORM_ERROR}`)
      }
      try {
        const { data } = await vm.$axios.get(Api.new.GET_ALL_GROUPS_ADMIN)
        this.groups = data
      } catch (e) {
        throw e
      } finally {
        vm.$refs[vm.currMode].open()
      }
    },
    async editTemporaryHandle($id: any) {
      const vm = this
      try {
        await vm.$store.dispatch(`category/${ActionsList.FIND}`, {
          slug: $id,
          isAdmin: true
        })
      } catch (e) {
        throw e
      } finally {
        vm.handleModal('edit')
      }
    }
  }
})
</script>
