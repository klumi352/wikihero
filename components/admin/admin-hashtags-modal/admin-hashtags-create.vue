<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <v-input
            name="title"
            :placeholder="$t('table.name')"
            :error="''"
            :value="form.title"
            @input="handle"
            @keypress.enter="store"
          />
          <v-textarea
            name="description"
            :error="''"
            :value="form.description"
            :placeholder="$t('table.description')"
            @input="handle"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.creating') }}</h1>
          <h3>
            <b>{{ 'Hashtag' }}</b> {{ $t('global.topic') }}
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
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-hashtag'

export default AdminMixins().extend({
  methods: {
    store() {
      this._store()
    },
    handle(e: Object, { key }: any = {}) {
      this._handleStoreHashtag(e, { key })
    }
  }
})
</script>
