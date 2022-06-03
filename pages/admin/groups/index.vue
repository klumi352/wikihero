<template>
  <div>
    <h1>{{ $t('global.groups') }}</h1>
    <!-- Create btn -->
    <button
      :title="$t('admin.create-group')"
      class="g-btn g-btn--link"
      @click="handleModal('create')"
    >
      <icon-plus width="12" height="12" />&nbsp;{{ $t('admin.create-group') }}
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
        <a
          target="_blank"
          :href="`${data.row.topic.computed_slug}/${data.row.slug}`"
          :title="$t('admin.open')"
          class="g-t-btn"
        >
          <icon-open width="20" height="20" />
        </a>

        <button
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="
            slugSetting(data.row.slug)
            editHandle(data.row.id)
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store.dispatch('group/DELETE', { id: data.row.id }).then(refresh)
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
    <!--  -->

    <!-- @@@ Modal create -->
    <modal-view
      key="create-group"
      ref="modalCreateGroup"
      v-slot="{ isOpen }"
      extra-wide
      name="create-group"
    >
      <div v-if="isOpen">
        <CreateGroup
          @stored="
            $refs.modalCreateGroup.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->

    <!-- @@@ Modal create -->
    <modal-view
      key="edit-group"
      ref="modalEditGroup"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-group"
    >
      <div v-if="isOpen">
        <EditGroup
          @edited="
            $refs.modalEditGroup.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-catch */
// Components
import CreateGroup from '~/pages/_topic/_group/@create.vue'
import EditGroup from '@/pages/_topic/_group/@edit.vue'

// import Vue from 'vue'

/**
 * ALL METHODS IS THERE
 */
import { ActionsList, MutationsList } from '@/store/group'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'

export default AdminMixins({ getPath: Api.new.GET_ALL_GROUPS_ADMIN }).extend({
  components: {
    CreateGroup,
    EditGroup
  },
  filters: {
    generateUrl(data: any) {
      return `/${data.row.group?.slug}/${data.row.slug}`
    }
  },
  data() {
    const vm = this as any
    return {
      topics: [],
      currMode: '',
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
          field: 'topic.name',
          sortable: false
        },
        {
          label: vm.$t('table.description'),
          field: 'description',
          sortable: false
        },
        {
          label: vm.$t('table.followers'),
          field: 'subscribers',
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '110px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    handleModal($mode: String) {
      const vm = this
      switch ($mode) {
        case 'create':
          vm.currMode = 'modalCreateGroup'
          vm.$store.commit(`group/${MutationsList.SET_INITIAL_FORM}`)
          break
        case 'edit':
          vm.currMode = 'modalEditGroup'
      }
      vm.$refs[vm.currMode].open()
    },
    async editHandle($id: any) {
      const vm = this
      try {
        await vm.$store.dispatch(`group/${ActionsList.FIND}`, {
          slug: $id,
          isAdmin: true
        })
      } catch (e) {
        console.error(e)
      } finally {
        vm.handleModal('edit')
      }
    }
  }
})
</script>
