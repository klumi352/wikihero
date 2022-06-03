<template>
  <div>
    <h1>{{ $t('post.admin-title') }}</h1>
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
              data: computePostInfo(data.row)
            })
          "
        >
          <icon-eye width="20" height="20" />
        </button>
      </template>
      <!--  -->

      <!-- Action template -->
      <!-- eslint-disable-next-line vue/no-unused-vars -->
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
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="
            () => {
              slugSetting(data.row.slug)
              editHandle(data.row.id)
            }
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.confirm')"
          class="g-t-btn g-btn--publish"
          :disabled="false"
          @click="
            () => {
              $store
                .dispatch('post/APPROVE_POST', { id: data.row.id })
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
                .dispatch('post/DELETE_POST', { id: data.row.id })
                .then(refresh)
            }
          "
        >
          <icon-delete width="20" height="20" />
        </button>
      </template>
      <!--  -->
    </v-table>

    <!-- Modal -->
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

    <admin-modal :columns="columns" />
    <!--  -->
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { ChunkPostMixin } from '@/plugins/vue-extend/mixins/-admin-mixins-post-chunk'
import EditPost from '~/pages/_topic/_group/_post/@edit.vue'
import AdminModal from '@/components/admin/admin-modal/admin-modal.vue'
export default AdminMixins({ getPath: '/admin/posts/notification' }).extend({
  mixins: [ChunkPostMixin()],
  components: {
    EditPost,
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
          field: 'title',
          sortable: false,
          tdClass: 'g-highlight'
        },
        {
          label: vm.$t('table.group'),
          field: 'group.title',
          sortable: false
        },
        {
          label: vm.$t('table.user'),
          sortable: false,
          field: 'author.name'
        },
        {
          label: vm.$t('table.user-job-title'),
          sortable: false,
          field: 'author.job_title'
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
    computeRowStyle(r: any) {
      if (r.show_admin) return 'g-highlight-row'
      if (r.confirmed === 0) return 'g-highlight-error-row'
    },
    computePostInfo(v: any) {
      const post_info: object = {
        id: v.id,
        title: v.title,
        'group.title': v.group.title,
        'author.name': v.is_anonymous
          ? this.$t('table.post-anonymous')
          : v.author.name,
        'author.job_title': v.author.job_title,
        description: v.description,
        'author.email': v.author.email || this.$t('table.post-email-notleave')
      }
      return post_info
    }
  }
})
</script>
