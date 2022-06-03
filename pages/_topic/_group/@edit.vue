<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <v-baner>
          <!-- Image loader wrap -->
          <div class="group__loader-wrap a-df a-aic a-gap">
            <Photoloader
              :image-url="groupLogoUrl"
              :error="errors.logo"
              :title="$t('group.group-image-title')"
              @upload="editImageHandler($event, { type: 'logo' })"
            ></Photoloader>
            <Photoloader
              :image-url="groupModeratorUrl"
              :error="errors.moderator_image"
              :title="$t('group.moderator-image-title')"
              @upload="editImageHandler($event, { type: 'moderator_image' })"
            ></Photoloader>
          </div>
          <!-- --- -->
          <v-input
            :disabled="true"
            name="slug"
            :placeholder="$t('table.slug')"
            :error="errors.slug"
            :value="group.slug"
            @input="handle"
            @keypress.enter="put"
          />
          <v-input
            name="title"
            :placeholder="$t('table.name')"
            :error="errors.title"
            :value="group.title"
            @input="handle"
            @keypress.enter="put"
          />
          <v-textarea
            name="description"
            :error="errors.description"
            :value="group.description"
            :placeholder="$t('table.description')"
            @input="handle"
          />
          <div class="group a-df a-fdc">
            <h5 class="group__create--topic-title a-ffr">
              {{ $t('admin.topic-choose') }}
            </h5>
            <AdminSelect
              :store-data="group.topic"
              :list="topicsData"
              :error="errors.topic_id"
              selected-mode
              @select="selectHandler"
            ></AdminSelect>
          </div>
          <seo-module
            :errors="errors"
            :data="group"
            @was-keypress="put"
            @input="handle"
          />
        </v-baner>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.editing') }}</h1>
          <h3>
            <b>{{ $t('global.groups') }}</b> {{ $t('global.topic') }}
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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */

import { mapActions, mapGetters, mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-topic'
import { MutationsList } from '@/store/group'
import AdminSelect from '@/components/admin/admin-select/admin-select.vue'
import Photoloader from '@/chunk/forms/v-photoloader/v-photoloader.vue'
import { Api } from '@/api.config'
export default AdminMixins({ compareRoute: 'topic-group-@edit' }).extend({
  components: {
    AdminSelect,
    Photoloader
  },
  data() {
    return {
      imageData: null,
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
  async fetch({ store, error, route, $axios, params }) {
    try {
      if (route.name === 'topic-group-@edit') {
        const { data }: any = await $axios.get(
          Api.new.GROUP_BY_SLUG(params.group)
        )
        store.commit('group/SET_GROUP', data)
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    ...mapState('group', ['group', 'group_page', 'errors']),
    ...mapGetters('group', ['groupLogoUrl', 'groupModeratorUrl'])
  },
  methods: {
    handle(e: Object, { key }: any = {}) {
      const vm = this as any
      vm._handleEditGroup(e, { key })
    },
    selectHandler(value: Number) {
      const vm = this as any
      vm.$store.commit(`group/${MutationsList.HANDLE_GROUP_INPUT}`, {
        name: 'topic_id',
        value
      })
    },
    put() {
      const vm = this as any
      vm._put()
    }
  }
})
</script>
