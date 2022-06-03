<template>
  <modal-view
    key="post-filter"
    ref="modal"
    v-slot="{ isOpen }"
    name="post-filter"
    like-filter
  >
    <GlobalFilter v-if="isOpen" @post="post"></GlobalFilter>
  </modal-view>
</template>

<style lang="scss" scoped>
@import 'filter';
</style>

<script lang="ts">
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import GlobalFilter from '@/chunk/modules/global-filter/filter.vue'

export default Vue.extend({
  components: {
    GlobalFilter
  },
  computed: {
    ...mapState('group', ['group_page']),
    ...mapState('filter', [
      'selected_hashtags',
      'selected_categories',
      'sort_type'
    ]),
    ...mapGetters('filter', ['getHashtagsId', 'getCategsId'])
  },
  methods: {
    open(): void {
      // @ts-ignore
      this.$refs.modal?.open()
    },
    async post() {
      try {
        await this.$store
          .dispatch('post/GET_POSTS_LIST', {
            id: this.group_page.id,
            categ_id: this.getCategsId,
            hashtag_id: this.getHashtagsId,
            order_by: this.sort_type !== '' ? this.sort_type : 'recent'
          })
          .then(() => {
            // @ts-ignore
            this.$refs.modal?.close()
          })
      } catch (e) {
        throw e
      }
    }
  }
})
</script>
