<template>
  <modal-view
    key="forgot-resolve"
    ref="modal"
    v-slot="{ isOpen }"
    no-close
    name="forgot-resolve"
    @closed="modalClose"
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-reset.title') }}</h2>
        <v-password
          :value="form.password"
          :error="errors.password"
          name="password"
          :placeholder="$t('modal-reset.1st-placeholder')"
          :hint="$t('modal-reset.1st-hint')"
          @input="handle"
        />
        <v-password
          :value="form.password_confirmation"
          :error="errors.password_confirmation"
          name="password_confirmation"
          :placeholder="$t('modal-reset.2st-placeholder')"
          :hint="$t('modal-reset.2st-hint')"
          @input="handle"
        />
        <div class="a-tar--mobile">
          <button class="g-btn" @click="sendRequest">
            {{ $t('modal-reset.btn') }}
          </button>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-reset.title-success') }}</h2>
        <div class="a-tar--mobile">
          <button class="g-btn" @click="$refs.modal.close()">
            {{ $t('modal-reset.btn-2') }}
          </button>
        </div>
      </v-step>
    </v-stepper>
  </modal-view>
</template>

<script lang="ts">
import has from 'lodash/has'
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
  mounted() {
    this.handle({
      target: {
        name: 'token',
        value: this.$route.query.reset
      }
    })
  },
  methods: {
    modalClose() {
      this.$router.replace('/login')
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
        .dispatch(`submit/send`, { path: Api.client.PASSWORD_RESET })
        .then(() => {
          this.currentStep++
        })
        .catch(() => {
          if (has(this.errors, 'token') && this.errors.token) {
            this.$notification.error('token-expired')
            ;(this.$refs.modal as any).close()
          }
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'reset-pass';
</style>
