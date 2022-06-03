<template>
  <modal-view
    key="forgot"
    ref="modal"
    v-slot="{ isOpen }"
    name="forgot"
    @closed="modalClose"
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-forgot.title') }}</h2>
        <v-input
          :value="form.email"
          :error="errors.email"
          name="email"
          type="email"
          :placeholder="$t('modal-forgot.1st-placeholder')"
          :hint="$t('modal-forgot.1st-hint')"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <div class="a-tar--mobile">
          <button class="g-btn" @click="sendRequest">
            {{ $t('modal-forgot.send-link') }}
          </button>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-forgot.check-mail') }}</h2>
        <div class="a-tar--mobile">
          <button class="g-btn" @click="$refs.modal.close()">
            {{ $t('modal-forgot.btn') }}
          </button>
        </div>
      </v-step>
    </v-stepper>
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default Vue.extend({
  data() {
    return {
      currentStep: 0
    }
  },
  computed: {
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  methods: {
    modalClose() {
      if (this.currentStep === 1) {
        this.$router.push('/')
      }
      this.currentStep = 0
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
        .dispatch(`submit/send`, { path: Api.client.FORGOT_SENT_LINK })
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
@import 'forgot-pass';
</style>
