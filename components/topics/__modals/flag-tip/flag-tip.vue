<template>
  <modal-view
    key="flag-tip"
    ref="modal"
    v-slot="{ isOpen }"
    name="flag-tip"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <h2>{{ $t('modal-flag.head') }}</h2>
        <v-input
          :value="form.reason"
          :error="errors.reason"
          name="reason"
          :placeholder="$t('modal-flag.1st-pl')"
          :hint="$t('modal-flag.1st-hint')"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <v-input
          v-if="!loggedIn"
          :value="form.email"
          :error="errors.email"
          name="email"
          :placeholder="$t('modal-flag.2st-pl')"
          :hint="$t('modal-flag.2st-hint')"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <div class="a-tar--mobile">
          <button class="g-btn" @click="sendRequest">
            {{ $t('global.confirm') }}
          </button>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <div class="content">
          <h2>{{ $t('modal-flag.head-success') }}</h2>
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
// import { Api } from '@/api.config'
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
        this._handle('post_id', (this.$refs.modal as any).calledData)
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
          path: '/user/flag/post',
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
@import 'flag-tip';
</style>
