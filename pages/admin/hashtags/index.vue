<template>
  <div>
    <h1>{{ $t('global.hashtags') }}</h1>
    <!-- Create btn -->
    <button
      :title="translations.hashtag"
      class="g-btn g-btn--link"
      @click="createHashtag"
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
          @click="editHashtag(data.row.id)"
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store
              .dispatch(`hashtag/DELETE`, {
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
      key="create-hashtag"
      ref="modalCreateHashtag"
      v-slot="{ isOpen }"
      extra-wide
      name="create-hashtag"
      no-overflow
    >
      <div v-if="isOpen">
        <CreateHashtagsModal
          @stored="
            $refs.modalCreateHashtag.close()
            refresh()
          "
        />
      </div>
    </modal-view>
    <!-- -->

    <!-- @@@ Modal edit -->
    <modal-view
      key="edit-hashtag"
      ref="modalEditHashtag"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-hashtag"
      no-overflow
    >
      <div v-if="isOpen">
        <EditHashtagsModal
          @edited="
            $refs.modalEditHashtag.close()
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
import CreateHashtagsModal from '@/components/admin/admin-hashtags-modal/admin-hashtags-create.vue'
import EditHashtagsModal from '@/components/admin/admin-hashtags-modal/admin-hashtags-edit.vue'

import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { ActionsList, MutationsList } from '~/store/hashtag'

export default AdminMixins({
  getPath: Api.new.GET_ALL_HASHTAGS_ADMIN
}).extend({
  components: {
    CreateHashtagsModal,
    EditHashtagsModal
  },
  filters: {},
  data() {
    const vm = this as any
    return {
      translations: {
        title: 'Hashtag',
        create: 'create hashtag'
      },
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
    createHashtag() {
      this.$refs.modalCreateHashtag.open()
      this.$store.commit(`hashtag/${MutationsList.SET_INITIAL_HASHTAG}`)
    },
    async editHashtag(v: any) {
      await this.$store.dispatch(`hashtag/FIND`, {
        slug: v,
        isAdmin: true
      })
      this.$refs.modalEditHashtag.open()
    }
  }
})
</script>
