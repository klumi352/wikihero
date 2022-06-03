<template>
  <div>
    <h1>{{ $t('global.topics') }}</h1>
    <button
      :title="$t('admin.create-topic')"
      class="g-btn g-btn--link"
      @click="$refs.modalCreate.open()"
    >
      <icon-plus width="12" height="12" />&nbsp;{{ $t('admin.create-topic') }}
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
          :href="`/${data.row.slug}`"
          :title="$t('admin.open')"
          class="g-t-btn"
        >
          <icon-open width="20" height="20" />
        </a>
        <button
          :title="$t('admin.edit-topic')"
          class="g-t-btn"
          @click="
            currentSlug = data.row.slug
            $refs.modalEdit.open()
          "
        >
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button
          :title="$t('admin.create-topic')"
          class="g-t-btn"
          @click="
            slugSetting(data.row.id)
            handleModal('create', data.row.id)
          "
        >
          <icon-add width="20" height="20" />
        </button>
        <button
          :title="$t('admin.publish')"
          class="g-t-btn g-btn--publish"
          :class="{ active: !!data.row.published }"
          @click="
            $store
              .dispatch('topic/changePublish', { id: data.row.id })
              .then(refresh)
          "
        >
          <icon-publish width="20" height="20" />
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
    <!-- @@@ Modal create -->
    <modal-view
      key="create-index"
      ref="modalCreate"
      v-slot="{ isOpen }"
      extra-wide
      name="create-index"
    >
      <div v-if="isOpen">
        <create-index
          @stored="
            $refs.modalCreate.close()
            refresh()
          "
        />
      </div>
    </modal-view>
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
          :topics-list="topics"
          :topic-id="currOverallId"
          @stored="
            $refs.modalCreateGroup.close()
            refresh()
          "
        />
      </div>
    </modal-view>
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
  </div>
</template>

<script lang="ts">
/* eslint-disable no-useless-catch */
import CreateIndex from '@/pages/_topic/@create.vue'
import CreateGroup from '@/pages/_topic/_group/@create.vue'
import EditIndex from '@/pages/_topic/@edit.vue'
/**
 * ALL METHODS IS THERE
 */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'

export default AdminMixins({ getPath: Api.admin.GET_ALL_TOPIC }).extend({
  components: {
    CreateIndex,
    EditIndex,
    CreateGroup
  },
  data() {
    const vm = this as any
    return {
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
          label: vm.$t('table.followers'),
          field: 'follow_users_count',
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '162px',
          sortable: false
        }
      ],
      topics: [],
      currMode: '',
      currOverallId: null
    }
  },
  methods: {
    async handleModal($mode: String, $id: any): Promise<void> {
      const vm = this
      vm.currOverallId = $id
      switch ($mode) {
        case 'create':
          vm.currMode = 'modalCreateGroup'
          break
        case 'edit':
          vm.currMode = 'modalEditGroup'
      }
      try {
        const { data } = await vm.$axios.get(Api.client.TOPIC_OVERALL_ALL)
        this.topics = data
      } catch (e) {
        throw e
      } finally {
        vm.$refs[vm.currMode].open()
      }
    }
  }
})
</script>

<style lang="scss"></style>
