<template>
  <div class="topic-notfound" :class="{ noPadding }">
    <div class="form">
      <div v-if="$i18n.te('$i.no-search-result-result.url')" class="img-wrap">
        <img class="img" :src="$t('$i.no-search-result-result.url')" alt="" />
      </div>
      <!-- @@@ -->
      <v-stepper ref="stepper" v-model="currentStep">
        <!-- --- -->
        <v-step visible>
          <p class="a-mb-0">{{ $t('modal-help.head') }}</p>
          <div class="g-h3">{{ $t('modal-help.intro') }}</div>
          <br />
          <div class="inset">
            <v-input
              :value="form.user_looking_for"
              :error="errors.user_looking_for"
              name="user_looking_for"
              :placeholder="$t('modal-help.1st-placeholder')"
              :hint="$t('modal-help.1st-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <v-input
              v-if="!loggedIn"
              :value="form.email"
              :error="errors.email"
              name="email"
              :placeholder="$t('modal-help.2st-placeholder')"
              :hint="$t('modal-help.2st-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <div class="a-tar--mobile">
              <button class="g-btn" @click="sendRequest">
                {{ $t('modal-help.btn') }}
              </button>
            </div>
          </div>
        </v-step>
        <!-- --- -->
        <v-step>
          <p class="a-mb-0">{{ $t('modal-help.2st-head') }}</p>
          <div class="g-h3">{{ $t('modal-help.2st-intro') }}</div>
        </v-step>
        <!-- --- -->
      </v-stepper>
      <!-- @@@ -->
      <div class="a-mtb-20 a-fz-12-14 a-ffr">
        {{ $t('modal-help.bottom') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit-helper'

export default Vue.extend({
  props: {
    noPadding: Boolean
  },
  data() {
    return {
      currentStep: 0
    }
  },
  computed: {
    ...mapState('topic', ['topic']),
    ...mapGetters('auth', ['loggedIn', 'userEmail']),
    ...mapState('submit-helper', ['form', 'loading', 'errors'])
  },
  beforeDestroy() {
    this.$store.commit(`submit-helper/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit-helper/${mt.CLEAR_FORM_ERROR}`)
  },
  mounted() {
    this._handle('topic_id', this.topic.id)
    if (this.loggedIn) this._handle('email', this.userEmail)
  },
  methods: {
    _handle(name: any, value: any) {
      this.handle({ target: { name, value } })
    },
    handle(e: any) {
      /** clear errors */
      this.$store.commit(`submit-helper/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`submit-helper/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    sendRequest(): void {
      const stepper: any = this.$refs.stepper
      stepper.loading().show()
      this.$store
        .dispatch(`submit-helper/send`, {
          path: Api.client.OFFER_CONTRIBUTE,
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
@import 'no-search-result';
</style>
