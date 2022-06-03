<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <v-input
            name="name"
            :placeholder="$t('table.name')"
            :error="''"
            :value="seniority.name"
            @input="handle"
            @keypress.enter="put"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.edit') }}</h1>
          <h3>
            <b>{{ $t('global.levels') }}</b> {{ $t('global.topic') }}
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
/* eslint-disable vue/valid-v-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-seniority'

export default AdminMixins().extend({
  methods: {
    put() {
      this._put()
    },
    handle(e: Object, { key }: any = {}) {
      this._handleEditSeniority(e, { key })
    }
  }
})
</script>
