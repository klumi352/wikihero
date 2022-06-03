<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <!-- Image loader wrap -->
          <div class="group__loader-wrap a-df a-aic a-gap">
            <Photoloader
              :error="errors.logo"
              :title="$t('group.group-image-title')"
              @upload="storeImageHandler($event, { type: 'logo' })"
            ></Photoloader>
            <Photoloader
              :error="errors.moderator_image"
              :title="$t('group.moderator-image-title')"
              @upload="storeImageHandler($event, { type: 'moderator_image' })"
            ></Photoloader>
          </div>
          <!-- --- -->
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
          <div class="group a-df a-fdc">
            <h5 class="group__create--topic-title a-ffr">
              {{ $t('admin.topic-choose') }}
            </h5>
            <AdminSelect
              :error="errors.topic_id"
              :list="topicsData"
              @select="selectHandler"
            ></AdminSelect>
          </div>
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
            <b>{{ $t('global.groups') }}</b> {{ $t('global.topic') }}
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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import { mapState, mapGetters } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-topic'
import AdminSelect from '@/components/admin/admin-select/admin-select.vue'
import Photoloader from '@/chunk/forms/v-photoloader/v-photoloader.vue'
import { MutationsList } from '@/store/group'
import { Api } from '@/api.config'

export default AdminMixins({ compareRoute: 'topic-group-@create' }).extend({
  components: {
    AdminSelect,
    Photoloader
  },
  data() {
    return {
      topicsData: []
    }
  },
  async created() {
    try {
      const { data } = await this.$axios.get(Api.client.ALL_TOPICS)
      this.topicsData = data
    } catch (e) {
      throw e
    }
  },
  beforeDestroy() {
    this._destroy()
  },
  beforeMount() {
    const vm = this
    this.handleChange({
      target: {
        name: 'parent_id',
        value: vm.slug || vm.group.id
      }
    })
  },
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    ...mapState('group', ['form', 'group', 'errors']),
    ...mapState('topic', ['topic'])
  },
  methods: {
    store() {
      this._store({
        redirect: `/${this.$route.params.topic}/${this.form.slug}`
      })
    },
    handleChange(e: any) {
      this._slugGenerateGroup(e, { store: true })
      this._handleStoreGroup(e)
    },
    handle(e: any, { key }: any = {}) {
      this._slugGenerateGroup(e, { store: true })
      this._handleStoreGroup(e, { key })
    },
    selectHandler(value: Number) {
      const vm = this as any
      vm.$store.commit(`group/${MutationsList.HANDLE_FORM_INPUT}`, {
        name: 'topic_id',
        value
      })
    }
  }
})
</script>

<style lang="scss">
@import 'index.scss';
</style>
