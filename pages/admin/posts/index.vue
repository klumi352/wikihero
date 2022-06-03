<template>
  <div>
    <h1>{{ $t('post.admin-title') }}</h1>
    <button
      :title="$t('post.admin-create')"
      class="g-btn g-btn--link"
      @click="
        handleModal('create')
        $store.commit('post/SET_INITIAL_FORM')
        $store.commit('post/CLEAR_FORM_ERROR')
      "
    >
      <icon-plus width="12" height="12" />&nbsp;{{ $t('post.admin-create') }}
    </button>

    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      @change="change"
    >
      <template v-slot:actions="{ data }">
        <a
          target="_blank"
          :href="`${data.row.computed_slug}`"
          :title="$t('admin.open')"
          class="g-t-btn"
        >
          <icon-open width="20" height="20" />
        </a>

        <button
          :title="$t('admin.publish')"
          class="g-t-btn g-btn--publish"
          :class="{ active: !!data.row.is_active }"
          @click="
            $store
              .dispatch('post/CHANGE_PUBLISH', { id: data.row.id })
              .then(refresh)
          "
        >
          <icon-publish width="20" height="20" />
        </button>
        <button
          :title="$t('post.admin-edit')"
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
            $store
              .dispatch('post/DELETE_POST', { id: data.row.id })
              .then(refresh)
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>

    <modal-view
      key="create-post"
      ref="modalCreatePost"
      v-slot="{ isOpen }"
      extra-wide
      no-overflow
      name="create-post"
    >
      <div v-if="isOpen">
        <div>
          <CreatePost
            @stored="
              $refs.modalCreatePost.close()
              refresh()
            "
          />
        </div>
      </div>
    </modal-view>

    <modal-view
      key="edit-post"
      ref="modalEditPost"
      v-slot="{ isOpen }"
      extra-wide
      name="edit-post"
      no-overflow
    >
      <div v-if="isOpen">
        <div>
          <EditPost
            @edited="
              $refs.modalEditPost.close()
              refresh()
            "
          />
        </div>
      </div>
    </modal-view>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Components
import Vue from 'vue'
import CreatePost from '~/pages/_topic/_group/_post/@create.vue'
import EditPost from '~/pages/_topic/_group/_post/@edit.vue'
import { ActionsList } from '@/store/post'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'

export default AdminMixins({ getPath: '/admin/posts' }).extend({
  components: {
    CreatePost,
    EditPost
  },
  data() {
    const vm = this as any
    return {
      topics: [],
      currMode: '',
      columns: [
        {
          label: vm.$t('table.id'),
          width: '80px',
          field: 'id',
          sortable: false
        },
        {
          label: vm.$t('table.name'),
          field: 'title',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.parent'),
          field: 'group.title',
          sortable: false
        },
        {
          label: vm.$t('table.description'),
          field: 'description',
          sortable: false
        },
        {
          label: vm.$t('table.email'),
          field: 'author.email',
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '140px',
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
          vm.currMode = 'modalCreatePost'
          break
        case 'edit':
          vm.currMode = 'modalEditPost'
      }
      // @ts-ignore
      vm.$refs[vm.currMode].open()
    },
    async editHandle($id: any) {
      const vm = this
      try {
        await vm.$store.dispatch(`post/${ActionsList.FIND_POST}`, {
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
