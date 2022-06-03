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
            :value="form.slug"
            @input="handle"
            @keypress.enter="store"
          />
          <v-input
            name="title"
            :placeholder="$t('table.name')"
            :error="errors.title"
            :value="form.title"
            @input="handle"
            @keypress.enter="store"
          />
          <v-textarea
            name="description"
            :error="errors.description"
            :value="form.description"
            :placeholder="$t('table.description')"
            @input="handle"
          />
          <v-controll
            type="checkbox"
            name="special"
            :checked="form.special"
            :hint="'Special group'"
            @input="handleStore($event, { key: 'checked' })"
          />
          <AdminMultiSelect
            :list="groupsList"
            :label="'title'"
            :value="form.groups"
            name="groups"
            identifier="id"
            @select="handle"
          ></AdminMultiSelect>
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.creating') }}</h1>
          <h3>
            <b>{{ 'Category' }}</b> {{ $t('global.topic') }}
          </h3>
          <fetch-loading class="top" :class="{ loading }">
            <button :disabled="loading" class="g-btn" @click="store">
              {{ $t('global.save') }}
            </button>
          </fetch-loading>
        </div>
      </template>
    </layout-2>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/valid-v-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-category'
import AdminMultiSelect from '@/components/admin/admin-multiselect/admin-multiselect.vue'
import { slugify } from '@/helpers/slugify'
import { MutationsList } from '@/store/category'

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
  computed: {
    ...mapState('category', ['errors'])
  },
  methods: {
    store() {
      this._store()
    },
    handle(e: Object, { key }: any = {}) {
      const vm = this as any
      this._slugGenerate(e, { store: true })
      vm._handleStoreCategory(e, { key })
    },
    handleStore(e: any, { key = 'value' }: any = {}) {
      /** set to store */
      this.$store.commit(`category/${MutationsList.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target[key] ? 1 : 0
      })
    }
  }
})
</script>
