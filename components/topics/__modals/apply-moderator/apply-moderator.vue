<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    key="apply-moderator"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="apply-moderator"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-moderator.head') }} > {{ topic.name }}</h2>
        <div class="a-mw600px">
          <p>{{ $t('modal-moderator.subhead') }}</p>
          <div v-html="$t('modal-moderator.intro')" />
          <v-input
            :value="form.first_name"
            :error="errors.first_name"
            name="first_name"
            :placeholder="$t('modal-moderator.1st-pl')"
            :hint="$t('modal-moderator.1st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            :value="form.last_name"
            :error="errors.last_name"
            name="last_name"
            :placeholder="$t('modal-moderator.2st-pl')"
            :hint="$t('modal-moderator.2st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            :value="form.reason"
            :error="errors.reason"
            name="reason"
            :placeholder="$t('modal-moderator.3st-pl')"
            :hint="$t('modal-moderator.3st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            v-if="!loggedIn"
            :value="form.email"
            :error="errors.email"
            name="email"
            type="email"
            :placeholder="$t('modal-moderator.4st-pl')"
            :hint="$t('modal-moderator.4st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            :value="form.occupation"
            :error="errors.occupation"
            name="occupation"
            :placeholder="$t('modal-moderator.5st-pl')"
            :hint="$t('modal-moderator.5st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <v-input
            :value="form.link_to_web_site"
            :error="errors.link_to_web_site"
            name="link_to_web_site"
            :placeholder="$t('modal-moderator.6st-pl')"
            :hint="$t('modal-moderator.6st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <div class="a-tar--mobile">
            <button class="g-btn" @click="sendRequest">
              {{ $t('global.confirm') }}
            </button>
          </div>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <div class="content">
          <h2>{{ $t('modal-moderator.head-success') }}</h2>
          <h3>{{ $t('modal-moderator.subhead-success') }}</h3>
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
    ...mapState('submit', ['form', 'loading', 'errors']),
    ...mapState('group', ['group_page'])
  },
  watch: {
    opened(isOpen) {
      this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      if (isOpen) {
        this._handle('topic_id', this.group_page.topic.id)
        this._handle('group_id', this.group_page.id)
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
          path: Api.client.MODERATOR_REQUEST,
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
@import 'apply-moderator';
</style>
