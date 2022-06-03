<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <v-input
            :disabled="true"
            name="slug"
            :placeholder="$t('table.slug')"
            :error="errors.slug"
            :value="category.slug"
            @input="handle"
            @keypress.enter="put"
          />
          <v-input
            name="title"
            :placeholder="$t('table.name')"
            :error="errors.title"
            :value="category.title"
            @input="handle"
            @keypress.enter="put"
          />
          <v-textarea
            name="description"
            :error="errors.description"
            :value="category.description"
            :placeholder="$t('table.description')"
            @input="handle"
          />
          <v-controll
            type="checkbox"
            name="special"
            :checked="category.special"
            :hint="'Special group'"
            @input="handleEdit($event, { key: 'checked' })"
          />
          <AdminMultiSelect
            :list="groupsList"
            :label="'title'"
            :value="category.groups"
            name="groups"
            @select="handle"
          ></AdminMultiSelect>
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.editing') }}</h1>
          <h3>
            <b>{{ 'Category' }}</b> {{ $t('global.topic') }}
          </h3>
          <fetch-loading class="top" :class="{ loading }">
            <button :disabled="loading" class="g-btn" @click="put">
              {{ $t('global.save') }}
            </button>
          </fetch-loading>
        </div>
      </template>
    </layout-2>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-category'
import { MutationsList } from '@/store/category'

import AdminMultiSelect from '@/components/admin/admin-multiselect/admin-multiselect.vue'

export default AdminMixins().extend({
  props: {
    groupsList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AdminMultiSelect
  },
  data() {
    return {}
  },
  created() {},
  computed: {
    ...mapGetters('category', ['getGroupsWithId']),
    ...mapState('category', ['errors'])
  },
  methods: {
    handle(e: Object, { key }: any = {}) {
      const vm = this as any
      this._slugGenerate(e, { edit: true })
      vm._handleEditCategory(e, { key })
    },
    put() {
      const vm = this as any
      vm._put()
    },
    handleEdit(e: any, { key = 'value' }: any = {}) {
      /** set to store */
      this.$store.commit(`category/${MutationsList.HANDLE_CATEGORY_INPUT}`, {
        name: e.target.name,
        value: e.target[key] ? 1 : 0
      })
    }
  }
})
</script>
