<template>
  <div v-if="loggedIn">
    <layout-3>
      <template v-slot:default>
        <!-- --- -->
        <v-baner>
          <div class="a-mw600px">
            <v-status no-animation />
          </div>
        </v-baner>

        <div class="a-mw800px">
          <admin-info class="only-tablet" />
        </div>

        <v-tab
          small
          class="a-mt-60-100 profile-page"
          name="work-tip"
          :items="$t('setting.main-tabs').split(',')"
          @change="currentStep = $event.index"
        />

        <v-stepper
          ref="stepper"
          v-model="currentStep"
          preloader-position="top"
          preloader-top
          no-overflow
        >
          <v-step visible>
            <br />
            <PostList />
            <br />
            <br />
            <CommentList />
            <br />
            <br />
            <all-tips />
          </v-step>
          <!-- --- -->
          <v-step>
            <br />
            <profile-setting />
          </v-step>
          <!-- --- -->
        </v-stepper>
        <!-- --- -->
      </template>
    </layout-3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { headGenerator } from '@/helpers/headGenerator'
import ProfileSetting from '@/components/profile/profile-setting/profile-setting.vue'
import AllTips from '@/components/profile/all-tips/all-tips.vue'
import PostList from '@/components/common/post-list-component/post-list.vue'
import CommentList from '@/components/profile/profile-comment-list/profile-comment-list.vue'

export default Vue.extend({
  name: 'ProfilePage',
  middleware: 'only-auth',
  components: {
    AllTips,
    ProfileSetting,
    PostList,
    CommentList
  },
  async fetch({ store, error }) {
    try {
      await store.dispatch('profile/boot')
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  data() {
    return {
      currentStep: 0
    }
  },
  computed: {
    ...mapState('auth', ['level']),
    ...mapState('profile', ['data']),
    ...mapGetters('auth', ['loggedIn'])
  },
  watch: {
    currentStep(value) {
      if (value === 0) {
        //* reinit user personal info
        this.$store.dispatch('profile/boot')
      }
    }
  },
  head() {
    return headGenerator({
      name: this.$t('meta.profile-title')
    })
  }
})
</script>

<style lang="scss" scoped></style>
