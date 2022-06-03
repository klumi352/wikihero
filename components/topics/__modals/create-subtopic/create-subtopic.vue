<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    key="create-topic"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="create-topic"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-sub.head') }} > {{ topic.name }}</h2>
        <div class="a-mw700px">
          <v-input
            :value="form.name"
            :error="errors.name"
            :max-length="60"
            name="name"
            :placeholder="$t('modal-sub.1st-pl')"
            :hint="$t('modal-sub.1st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            :value="form.reason"
            :error="errors.reason"
            name="reason"
            :placeholder="$t('modal-sub.2st-pl')"
            :hint="$t('modal-sub.2st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            v-if="!loggedIn"
            :value="form.email"
            :error="errors.email"
            name="email"
            type="email"
            :placeholder="$t('modal-sub.3st-pl')"
            :hint="$t('modal-sub.3st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <div class="a-tar--mobile">
            <button class="g-btn" @click="sendRequest">
              {{ $t('global.confirm') }}
            </button>
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
        <div class="content">
          <h2>{{ $t('modal-sub.head-success') }}</h2>
          <div v-html="$t('modal-sub.subhead-success')"></div>
          <div class="space a-mw500px a-tar--mobile">
            <button class="g-btn" @click="() => $refs.modal.close()">
              {{ $t('global.close') }}
            </button>
          </div>
        </div>
        <img class="pic" :src="$t('$i.success-non-logged.url')" alt="" />
      </v-step>
      <!-- --- -->
    </v-stepper>
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default Vue.extend({
  data() {
    return {
      opened: false,
      currentStep: 0
    }
  },
  computed: {
    ...mapState('topic', ['topic']),
    ...mapGetters('auth', ['loggedIn', 'userEmail']),
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  watch: {
    opened(isOpen) {
      this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      if (isOpen) {
        this._handle('parent_id', this.topic.id)
        if (this.loggedIn) this._handle('email', this.userEmail)
      }
    }
  },
  methods: {
    _handle(name: any, value: any) {
      this.handle({ target: { name, value } })
    },
    handle(e: any) {
      /** clear errors */
      this.$store.commit(`submit/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`submit/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    sendRequest(): void {
      const stepper: any = this.$refs.stepper
      stepper.loading().show()
      this.$store
        .dispatch(`submit/send`, {
          path: Api.client.TOPIC_CONTRIBUTE,
          withRecaptcha: true
        })
        .then(() => {
          this.currentStep++
        })
        .catch(() => {})
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'create-subtopic';
</style>
