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
            name="name"
            :placeholder="$t('table.name')"
            :error="errors.name"
            :value="form.name"
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
          <seo-module
            :errors="errors"
            :data="form"
            @was-keypress="store"
            @input="handle"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.creating') }}</h1>
          <h3>
            <b>{{ $t('global.overall') }}</b> {{ $t('global.topic') }}
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
import { mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-topic'

export default AdminMixins({ compareRoute: 'topic-@create' }).extend({
  name: 'TopicEdit',
  beforeDestroy() {
    this._destroy()
  },
  computed: {
    ...mapState('topic', ['form', 'errors'])
  },
  methods: {
    store() {
      this._storeTopic()
    },
    handle(e: any) {
      this._slugGenerate(e, { store: true })
      this._handleStoreTopic(e)
    }
  }
})
</script>

<style lang="scss"></style>
