<template>
  <modal-view
    key="prompt"
    ref="modal"
    v-slot="{ isOpen }"
    mini
    name="prompt"
    @opened="opened = true"
    @closed="
      closeAction()
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <div v-if="$refs.modal.calledData.title">
          <h3 v-if="!isConfirmModal">{{ $refs.modal.calledData.title }}</h3>
          <h2 v-else>{{ $refs.modal.calledData.title }}</h2>
        </div>
        <div v-if="isTextModal" class="intro">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="$refs.modal.calledData.intro"></div>
        </div>
        <div v-else>
          <v-textarea
            v-if="!isConfirmModal"
            class="a-mt-0 a-mb-10"
            :value="txt"
            @input="(e) => (txt = e.target.value)"
          />
          <div v-if="!isConfirmModal" class="a-tar">
            <button class="g-btn g-btn--link" @click="sendRequest">
              {{ $t('global.confirm') }}
            </button>
          </div>
          <div v-else class="a-tar">
            <button class="g-btn g-btn--dark" @click="$refs.modal.close()">
              {{ $t('global.no') }}
            </button>
            <button class="g-btn g-btn--fill" @click="sendRequest">
              {{ $t('global.yes') }}
            </button>
          </div>
        </div>
      </v-step>
      <!-- --- -->
    </v-stepper>
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      txt: '',
      opened: false,
      currentStep: 0
    }
  },
  computed: {
    isConfirmModal() {
      const modal = this.$refs.modal as any
      return modal.calledData.confirmModal
    },
    isTextModal() {
      const modal = this.$refs.modal as any
      return modal.calledData.textModal
    }
  },
  watch: {
    opened(isOpen) {
      if (isOpen) {
        /** Reinit */
        this.txt = ''
      }
    }
  },
  created() {
    const vm = this
    if (process.server) return

    Vue.$showPrompt = function(data: any) {
      vm.$root.$emit('show-modal', { name: 'prompt', data: data || {} })
    }
  },
  methods: {
    closeAction() {
      const vm = this
      const modal = vm.$refs.modal as any
      if (modal.calledData.closeAction) {
        modal.calledData.closeAction()
      }
    },
    sendRequest(): void {
      const vm = this
      const modal = vm.$refs.modal as any
      const stepper: any = vm.$refs.stepper
      stepper.loading().show()

      const action = modal.calledData.action
      if (!action) return

      modal.calledData
        .action(vm.txt, vm)
        .then(() => {
          modal.close()
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'v-prompt';
</style>
