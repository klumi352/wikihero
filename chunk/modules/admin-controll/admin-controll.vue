<template>
  <div
    v-if="isAdmin && Object.values(opt).filter(Boolean).length"
    class="admin-controll"
  >
    <nuxt-link
      v-if="opt.isCreateTip"
      append
      :title="$t('admin.create-tip')"
      :to="{ path: '@create-tip' }"
      class="button-create-tip g-t-btn"
    >
      <icon-delete width="23" height="23" />
    </nuxt-link>
    <nuxt-link
      v-if="opt.isCreateable"
      append
      :title="$t('admin.create-topic')"
      :to="{ path: '@create' }"
      class="button-create g-t-btn"
    >
      <icon-delete width="23" height="23" />
    </nuxt-link>
    <nuxt-link
      v-if="opt.isEditable"
      append
      :title="$t('admin.edit-topic')"
      :to="{ path: '@edit' }"
      class="button-edit g-t-btn"
    >
      <icon-edit width="23" height="23" />
    </nuxt-link>
    <nuxt-link
      v-if="opt.isMoveable"
      append
      :title="$t('admin.reorder')"
      :to="{ path: '@reorder' }"
      class="button-edit g-t-btn"
    >
      <icon-move width="23" height="23" />
    </nuxt-link>
    <button
      v-if="opt.isDeleteable"
      :title="$t('admin.delete')"
      class="button-delete g-t-btn"
      @click="del"
    >
      <icon-delete width="23" height="23" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
export default Vue.extend({
  data() {
    return {
      publish: true,
      opt: {
        isEditable: false,
        isMoveable: false,
        isCreateable: false,
        isCreateTip: false,
        isDeleteable: false
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn', 'isAdmin']),
    ...mapState('group', ['group_page']),
    ...mapState('post', ['post_page'])
  },
  watch: {
    $route() {
      this.checkMeta()
    }
  },
  created() {
    this.checkMeta()
  },
  methods: {
    del() {
      switch (this.$route.name) {
        case 'topic-group':
          this.$store.dispatch('group/DELETE', {
            trigger: true,
            id: this.group_page.id
          })
          break
        case 'topic-group-post':
          this.$store.dispatch('group/DELETE_POST', {
            trigger: true,
            id: this.post_page.id
          })
          break
        default:
          this.$store.dispatch('topic/delete', { trigger: true })
          break
      }
    },
    isExistMeta(x: string) {
      const meta = this.$nuxt.$options.context.route.meta
      const isFind = !!meta.find((i: any) => i[x])
      return isFind
    },
    checkMeta() {
      this.opt.isMoveable = this.isExistMeta('moveable')
      this.opt.isCreateable = this.isExistMeta('createable')
      this.opt.isEditable = this.isExistMeta('editable')
      this.opt.isDeleteable = this.isExistMeta('deleteable')
      this.opt.isCreateTip = this.isExistMeta('create_tip')
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'admin-controll';
</style>
