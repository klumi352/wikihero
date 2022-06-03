<template>
  <modal-view
    key="confirm-user"
    ref="modal"
    v-slot="{ isOpen }"
    no-close
    name="confirm-user"
    @closed="modalClose"
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step>
        <h2>{{ $t('confirm-email.title') }}</h2>
        <br />
        <div class="a-tar--mobile">
          <button class="g-btn" @click="sendRequest">
            {{ $t('global.confirm') }}
          </button>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('confirm-email.title-success') }}</h2>
        <div class="a-tar--mobile">
          <button class="g-btn" @click="$refs.modal.close()">
            {{ $t('global.home') }}
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
        value: this.$route.query['change-mail']
      }
    })
  },
  methods: {
    modalClose() {
      this.$router.replace('/')
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
        .dispatch(`submit/send`, { path: Api.client.EMAIL_VERIFY })
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
@import 'reset-email';
</style>
