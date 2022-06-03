<template>
  <div>
    <h1>{{ $t('comment.admin-title') }}</h1>

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
          :href="`${data.row.computed_slug}`"
          :title="$t('admin.open')"
          class="g-t-btn"
        >
          <icon-open width="20" height="20" />
        </a>

        <button
          :title="$t('admin.publish')"
          class="g-t-btn g-btn--publish"
          :class="{ active: !data.row.is_blocked }"
          @click="
            $store
              .dispatch('comment/CHANGE_PUBLISH', {
                id: data.row.id,
                publish: !data.row.is_blocked
              })
              .then(refresh)
          "
        >
          <icon-publish width="20" height="20" />
        </button>
        <button
          :title="$t('post.admin-edit')"
          class="g-t-btn"
          @click="editComment(data.row.id)"
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            $store
              .dispatch('comment/DELETE_COMMENT', { id: data.row.id })
              .then(refresh)
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
    <!--  -->

    <!-- Modal -->
    <modal-view
      key="edit-comment"
      ref="modalEditComment"
      v-slot="{ isOpen }"
      wide
      name="edit-comment"
      no-overflow
    >
      <div v-if="isOpen">
        <div>
          <EditComment
            @edited="
              $refs.modalEditComment.close()
              test()
            "
          ></EditComment>
        </div>
      </div>
    </modal-view>
    <!--  -->
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import EditComment from '@/pages/admin/comments/@edit.vue'
export default AdminMixins({ getPath: '/admin/comments' }).extend({
  components: {
    EditComment
  },
  data() {
    return {
      columns: [
        {
          label: this.$t('table.id'),
          width: '80px',
          field: 'id',
          sortable: false
        },
        {
          label: this.$t('table.name'),
          field: 'author_name',
          width: '150px',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: this.$t('table.parent'),
          field: 'post.title',
          sortable: false
        },
        {
          label: this.$t('table.description'),
          field: 'body',
          sortable: false
        },
        {
          label: this.$t('table.actions'),
          field: 'actions',
          width: '135px',
          sortable: false
        }
      ]
    }
  },
  methods: {
    async editComment(v) {
      await this.$store.dispatch('comment/FIND_COMMENT', { id: v })
      this.$refs.modalEditComment.open()
    },
    test() {
      this.refresh()
    }
  }
})
</script>
