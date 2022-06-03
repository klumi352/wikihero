<template>
  <div>
    <h1>{{ $t('comment.admin-title') }}</h1>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      :row-style-class="(r) => computeRowStyle(r)"
      @change="change"
    >
      <!-- Custom template -->
      <template v-slot:custom-field="{ data }">
        <button
          class="g-t-btn"
          @click="
            $root.$emit('show-modal', {
              name: 'admin-modal',
              data: computeCommentInfo(data.row)
            })
          "
        >
          <icon-eye width="20" height="20" />
        </button>
      </template>
      <!--  -->

      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template v-slot:actions="{ data }">
        <button
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="
            () => {
              $refs.modalEditComment.open()
              $store.dispatch('comment/FIND_COMMENT', { id: data.row.id })
            }
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.confirm')"
          class="g-t-btn g-btn--publish"
          :class="{ active: !!data.row.is_active }"
          @click="
            () => {
              $store
                .dispatch('comment/APPROVE_COMMENT', { id: data.row.id })
                .then(refresh)
            }
          "
        >
          <icon-publish width="20" height="20" />
        </button>
        <button
          :title="$t('admin.delete')"
          class="g-t-btn"
          @click="
            () => {
              $store
                .dispatch('comment/DELETE_COMMENT', { id: data.row.id })
                .then(refresh)
            }
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>

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
              refresh()
            "
          ></EditComment>
        </div>
      </div>
    </modal-view>

    <admin-modal :columns="columns" />
    <!--  -->
  </div>
</template>

<script lang="ts">
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import EditComment from '@/pages/admin/comments/@edit.vue'
import AdminModal from '@/components/admin/admin-modal/admin-modal.vue'
export default AdminMixins({ getPath: Api.new.COMMENT_NOTIFICATION }).extend({
  components: {
    EditComment,
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
        {
          label: vm.$t('table.id'),
          width: '80px',
          field: 'id',
          sortable: false
        },
        {
          label: vm.$t('table.post-title'),
          field: 'post.title',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.group'),
          field: 'post.group.title',
          sortable: false
        },
        {
          label: vm.$t('table.user'),
          sortable: false,
          field: 'author_name'
        },
        {
          label: vm.$t('table.user-job-title'),
          sortable: false,
          field: 'author_job_title'
        },
        {
          label: vm.$t('table.description'),
          field: 'body',
          sortable: false
        },
        {
          label: vm.$t('table.email'),
          field: 'author_email',
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
    computeRowStyle(r: any) {
      if (r.show_admin) return 'g-highlight-row'
      if (r.confirmed === 0) return 'g-highlight-error-row'
    },
    computeCommentInfo(v: any) {
      const comment_info: object = {
        id: v.id,
        'post.title': v.post.title,
        'post.group.title': v.post.group.title,
        author_name: v.is_anonymous
          ? this.$t('table.anonymous-comment')
          : v.author_name,
        author_job_title: v.author_job_title,
        body: v.body,
        author_email: v.author_email || this.$t('table.email-comment-notleave')
      }
      return comment_info
    }
  }
})
</script>
