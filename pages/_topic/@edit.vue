<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <v-input
            :disabled="true"
            name="slug"
            :error="errors.slug"
            :placeholder="$t('table.slug')"
            :value="topic.slug"
            @input="handle"
            @keypress.enter="put"
          />
          <v-input
            name="name"
            :error="errors.name"
            :placeholder="$t('table.name')"
            :value="topic.name"
            @input="handle"
            @keypress.enter="put"
          />
          <v-textarea
            name="description"
            :error="errors.description"
            :value="topic.description"
            :placeholder="$t('table.description')"
            @input="handle"
          />
          <seo-module
            :errors="errors"
            :data="topic"
            @was-keypress="put"
            @input="handle"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.editing') }}</h1>
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
import { mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-topic'

export default AdminMixins({ compareRoute: 'topic-@edit' }).extend({
  name: 'TopicEdit',
  async fetch({ store, params, error }) {
    try {
      await store.dispatch('topic/findSingleTopic', { slug: params.topic })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  created() {
    if (this.slug && process.client) {
      this.forceFetch()
    }
  },
  computed: {
    ...mapState('topic', ['topic', 'errors'])
  },
  beforeDestroy() {
    this._destroy()
  },
  methods: {
    forceFetch() {
      this._forceFetch({ params: { topic: this.slug } })
    },
    put() {
      this._putTopic()
    },
    handle(e: any) {
      this._handleEditTopic(e)
    }
  }
})
</script>

<style lang="scss"></style>
