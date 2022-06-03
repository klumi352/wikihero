<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    :key="name"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    :name="name"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-tip.head') }}{{ topicName }}</h2>
        <h3 v-if="!isNoGroup">
          <span class="a-cblack"
            >{{ $t('modal-tip.publish-where') }}&nbsp;</span
          >
          {{
            form.worked_for_me
              ? $t('modal-tip.subhead-worked')
              : $t('modal-tip.subhead-notworked')
          }}
        </h3>
        <div class="a-mw600px">
          <v-input
            :value="form.name"
            :error="errors.name"
            :max-length="60"
            name="name"
            :placeholder="$t('modal-tip.1st-pl')"
            :hint="$t('modal-tip.1st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-quill
            with-toolbar
            :error="errors.description"
            :placeholder="$t('modal-tip.2st-pl')"
            :value="form.description"
            name="description"
            @input="handle"
            @upload-image="uploadImage"
          />
          <v-input
            v-if="!loggedIn"
            :value="form.email"
            :error="errors.email"
            name="email"
            type="email"
            :placeholder="$t('modal-tip.3st-pl')"
            :hint="$t('modal-tip.3st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-controll
            v-if="!isAdmin"
            :error="errors.anonymous_tip"
            name="anonymous_tip"
            type="checkbox"
            :hint="$t('modal-tip.4st-pl')"
            @input="handle($event, { key: 'checked' })"
          />
          <div v-if="!isNoGroup">
            <div class="g-h3">
              {{ $t('modal-tip.5st-pl') }}
            </div>
            <v-controll
              :error="errors.worked_for_me"
              name="worked_for_me"
              type="radio"
              :checked="form.worked_for_me === 1"
              :hint="$t('modal-tip.5st-opt-1')"
              value="1"
              @input="handle"
            />
            <v-controll
              :error="errors.worked_for_me"
              name="worked_for_me"
              type="radio"
              :checked="form.worked_for_me === 0"
              :hint="$t('modal-tip.5st-opt-2')"
              value="0"
              @input="handle"
            />
          </div>
          <br />
          <div class="a-tar--mobile">
            <button class="g-btn" @click="sendRequest">
              {{ $t('global.confirm') }}
            </button>
          </div>
          <div class="a-ffr a-fz-12-14">
            {{ $t('modal.once-submit') }}
          </div>
          <div v-if="!loggedIn" class="g-h3 a-fz-18">
            <br />
            <i18n path="modal.have-account" tag="span">
              <template #link>
                <nuxt-link
                  :to="`/login/?redirect=${$route.path}`"
                  class="g-link"
                >
                  {{ $t('global.sign-in') }}</nuxt-link
                >
              </template>
            </i18n>
          </div>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <!-- FOR NO_LOGGED USER -->
        <div class="content">
          <h2>{{ $t('modal-tip.head-no-log') }}</h2>
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
            <div v-html="$t('modal-tip.subhead-no-log')"></div>
            <br />
            <div class="a-tar--mobile">
              <button class="g-btn" @click="() => $refs.modal.close()">
                {{ $t('global.close') }}
              </button>
              <nuxt-link
                class="g-btn g-btn--fill"
                :to="`/signup/?redirect=${$route.path}&reward=1`"
                @click.native="
                  $analytic.trackers.goalRegistration.redirectFromReward()
                "
              >
                {{ $t('modal.get-points-btn') }}
              </nuxt-link>
            </div>
            <div class="a-ffr a-fz-12-14">
              {{ $t('modal.once-submit') }}
            </div>
          </div>
        </div>
        <img
          class="pic"
          :src="
            isLevelUp ? $t('$i.level-up.url') : $t('$i.success-non-logged.url')
          "
          alt=""
        />
      </v-step>
      <!-- --- -->
      <v-step>
        <!-- FOR LOGGED USER -->
        <div class="content">
          <h2>{{ $t('modal-tip.head-log') }}</h2>
          <br />
          <div class="a-mw700px">
            <h2 class="a-cb">
              {{
                isLevelUp
                  ? $t('modal.level-up', {
                      level: level.level
                    })
                  : $t('modal.earn', {
                      count: level.count_points
                    })
              }}
            </h2>
            <br />
            <v-status />
          </div>
          <div class="space a-mw600px">
            <div class="a-tar--mobile">
              <button class="g-btn" @click="() => $refs.modal.close()">
                {{ $t('global.close') }}
              </button>
            </div>
            <div class="a-ffr a-fz-12-14">
              {{ $t('modal.once-submit') }}
            </div>
          </div>
        </div>
        <img
          class="pic"
          :src="
            isLevelUp ? $t('$i.level-up.url') : $t('$i.success-add-tip.url')
          "
          alt=""
        />
      </v-step>
      <!-- --- -->
    </v-stepper>
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { mt } from '@/store/submit'
import { mt as mtAuth } from '@/store/auth'
import { Api } from '@/api.config'
import { transformKey } from '@/helpers'

const transformer = transformKey([
  ['anonymous_tip', Number],
  ['worked_for_me', Number]
])

export default Vue.extend({
  props: {
    name: {
      type: String,
      default: 'contribute-tip'
    }
  },
  data() {
    return {
      opened: false,
      currentStep: 0
    }
  },
  computed: {
    isSubtopicPage(): boolean {
      return this.$route.name === 'topic-subtopic'
    },
    topicName(): string {
      return this.isSubtopicPage ? ` > ${this.topic.name}` : ''
    },
    ...mapState('topic', ['topic']),
    ...mapState('auth', ['level']),
    ...mapState('tip', ['globalIsWorked']),
    ...mapState('submit', ['form', 'loading', 'errors']),
    ...mapGetters('topic', ['isNoGroup']),
    ...mapGetters('auth', ['loggedIn', 'userEmail', 'isAdmin', 'isLevelUp'])
  },
  watch: {
    opened(isOpen) {
      this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      if (isOpen) {
        if (this.isSubtopicPage) this._handle('topic_id', this.topic.id)
        this._handle('worked_for_me', Number(this.globalIsWorked))
        if (this.loggedIn) this._handle('email', this.userEmail)
      }
    }
  },
  methods: {
    open(): void {
      // @ts-ignore
      this.$refs.modal?.open()
    },
    _handle(name: any, value: any) {
      this.handle({ target: { name, value } })
    },
    uploadImage(id: any) {
      this._handle('image', id)
    },
    handle(e: any, { key }: any = {}) {
      /** clear errors */
      this.$store.commit(`submit/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`submit/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: transformer(e.target[key || 'value'], e.target.name)
      })
    },
    sendRequest(): void {
      const vm = this
      const stepper: any = vm.$refs.stepper
      stepper.loading().show()

      vm.$store
        .dispatch(`submit/send`, {
          path: Api.client.TIP_CONTRIBUTE,
          withRecaptcha: true
        })
        .then((data: any) => {
          vm.$store.commit(`auth/${mtAuth.SET_USER_LEVEL}`, data.points)
          vm.currentStep++
          vm.$analytic.trackers['contribute-tip']()
          // show 3rd step
          vm.loggedIn && vm.currentStep++
        })
        .catch((data) => {
          if (!data) vm.$notification.error('smth')
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'contribute-tip';
</style>
