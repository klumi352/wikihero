<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <div>
          <UserInfoBar :user-info="fetch_comment_data"></UserInfoBar>
          <VueAreaInput
            :area-value="comment.body"
            :placeholder-value="`Aidez ${fetch_comment_data.author_name}...`"
            @area-change="handler($event, { key: 'value' })"
          />
        </div>
      </template>
      <template v-slot:aside>
        <div>
          <h1>{{ $t('global.edit') }}</h1>
          <h3>
            <b>{{ $t('comment.admin-title') }}</b> {{ $t('global.topic') }}
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

<script>
/* eslint-disable vue/no-unused-components */
import { mapState } from 'vuex'
import UserInfoBar from '@/chunk/common/user-info-bar/user-info-bar.vue'
import VueAreaInput from '@/chunk/forms/v-text-area/v-text-area.vue'
export default {
  components: {
    UserInfoBar,
    VueAreaInput
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('comment', ['fetch_comment_data', 'comment'])
  },
  methods: {
    handler(e, { key } = {}) {
      this.$store.commit('comment/HANDLE_FORM_INPUT', {
        name: 'body',
        value: e.target[key]
      })
    },
    async put() {
      await this.$store.dispatch('comment/EDIT_COMMENT', {
        id: this.fetch_comment_data.id
      })
      this.$emit('edited')
    }
  }
}
</script>
