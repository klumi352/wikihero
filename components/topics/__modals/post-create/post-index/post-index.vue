<template>
  <v-stepper ref="stepper" v-model="currentStep" no-overflow>
    <!-- Initial step -->
    <v-step>
      <transition name="fade" mode="out-in">
        <component
          :is="currentComponent"
          @switch="(c) => (currentComponent = c)"
          @post="post"
          @fetch-category="
            (data) => $store.commit('post-create/SET_CATEGORY_DATA', data)
          "
        ></component>
      </transition>
    </v-step>
    <!-- --- -->

    <!-- No logged user point popup -->
    <v-step>
      <!-- FOR NO_LOGGED USER -->
      <div class="post-create-popup">
        <div class="post-create-popup__content">
          <div class="post-create-popup__header">
            <h2>{{ $t('modal-tip.head-no-log') }}</h2>
            <span class="a-ffr a-fz-12-14">{{
              'Now your post will be reviewed before being live'
            }}</span>
          </div>
          <br />
          <div class="a-mw700px">
            <div class="g-h2 a-cb">
              {{
                isLevelUp
                  ? $t('modal.level-up', {
                      level: level.level
                    })
                  : $t('modal.earn', {
                      count: level.count_points
                    })
              }}
            </div>
            <div class="g-h3">
              <i18n path="modal.save-message" tag="span">
                <template #sign>
                  <nuxt-link
                    class="g-link"
                    :to="`/signup/?redirect=${$route.path}`"
                    >{{ $t('modal.sign-part') }}</nuxt-link
                  >
                </template>
                <template #logging>
                  <nuxt-link
                    class="g-link"
                    :to="`/login/?redirect=${$route.path}`"
                    >{{ $t('modal.logging-part') }}</nuxt-link
                  >
                </template>
              </i18n>
            </div>
            <br />
            <v-status />
          </div>
          <div class="a-mw500px">
            <br />
            <div
              class="post-create-popup__decription"
              v-html="$t('modal-tip.subhead-no-log')"
            ></div>
            <div class="a-tar--mobile post-create-popup__button-wrap">
              <button
                class="g-btn post-create-popup__close"
                @click="() => $refs.modal.close()"
              >
                {{ $t('global.close') }}
              </button>
              <nuxt-link
                class="g-btn g-btn--fill"
                :to="`/signup/?redirect=${$route.path}&reward=1`"
              >
                {{ $t('modal.get-points-btn') }}
              </nuxt-link>
            </div>
          </div>
          <img
            class="post-create-popup__pic"
            :src="$t('$i.success-non-logged.url')"
            alt=""
          />
        </div>
      </div>
    </v-step>
    <!-- --- -->
  </v-stepper>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import PostForm from '@/components/topics/__modals/post-create/post-form/post-form.vue'
import PostPreview from '@/components/topics/__modals/post-create/post-preview/post-preview.vue'
export default Vue.extend({
  components: {
    'post-form': PostForm,
    'post-preview': PostPreview
  },
  data() {
    return {
      currentComponent: 'post-form',
      currentStep: 0
    }
  },
  created() {
    const vm = this as any
    vm.setStoreGroup()
    vm.$store.dispatch('post-create/FETCH_DATA', { isGroupPage: !vm.groupPath })
  },
  computed: {
    ...mapState('group', ['group_page']),
    ...mapState('post', ['formHelp']),
    ...mapState('auth', ['level']),
    ...mapGetters('auth', ['loggedIn', 'isLevelUp']),
    groupPath() {
      const vm = this as any
      return vm.$route.name === 'topic-group'
    }
  },
  methods: {
    async post() {
      const vm = this as any
      let stepper: any
      vm.$store.commit('post/CLEAR_FORM_ERROR')
      if (!vm.loggedIn) {
        stepper = vm.$refs.stepper
        stepper.loading().show()
      }
      try {
        const data = await vm.$store.dispatch('post/CREATE_POST')
        vm.$store.commit('post/POST_CREATE')
        if (vm.loggedIn) {
          vm.$emit('close-popup')
          vm.$store.commit('group/TOOGLE_POINT_POPUP', data.group.slug)
          vm.$router.push(vm.formHelp.groupUrlRedirect)
          vm.$store.commit('post/SET_INITIAL_HELP')
        }
        if (!this.loggedIn) {
          vm.currentStep++
        }
        if (vm.groupPath && vm.loggedIn) {
          await vm.$store.dispatch('post/GET_POSTS_LIST', {
            id: vm.group_page.id
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!this.loggedIn) stepper.loading().hide()
      }
    },
    setStoreGroup() {
      const vm = this as any
      vm.$store.commit('post/SET_INITIAL_FORM')
      vm.$store.commit('post/CLEAR_FORM_ERROR')
      if (vm.loggedIn) {
        vm.$store.commit('post/SET_FORM_HELP', {
          name: 'groupUrlRedirect',
          value: vm.group_page.computed_slug
        })
      }
      if (vm.groupPath) {
        vm.$store.commit('post/HANDLE_FORM_INPUT', {
          name: 'topic_id',
          value: vm.group_page.topic.id
        })
        vm.$store.commit(
          'post-create/SET_CATEGORY_DATA',
          vm.group_page.categories
        )
        vm.$store.commit('post/HANDLE_FORM_INPUT', {
          name: 'group_id',
          value: vm.group_page.id
        })
      }
    }
  }
})
</script>
