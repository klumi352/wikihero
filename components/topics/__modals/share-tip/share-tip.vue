<template>
  <modal-view
    v-slot="{ isOpen }"
    key="share-tip"
    ref="modal"
    name="share-tip"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step>
        <h2>{{ $t(`modal-share.title`) }}</h2>
        <p>{{ $t(`modal-share.subtitle`) }}</p>
        <ul>
          <li v-for="(social, id) in social_methods" :key="id">
            <button
              data-web
              :data-title="tipName"
              :data-subject="tipName"
              :data-sharer="social.name"
              :data-url="tipUrl"
              :data-to="social.dataTo || ''"
              class="btn g-t-btn"
              :disabled="social.disabled"
              @click="share(social)"
            >
              <div class="g-h2">{{ $t(`modal-share.${social.name}`) }}</div>
              <svg :is="`icon-${social.name}`" width="55" height="55" />
            </button>
          </li>
        </ul>
      </v-step>
      <!-- --- -->
      <v-step>
        <div v-if="currentModal === 'embed'">
          <h2>{{ $t(`modal-share.embed-hint`) }}</h2>
          <v-textarea minimal with-copy :value="embedHTML"></v-textarea>
          <div class="a-tar--mobile">
            <button class="g-btn" @click="currentStep--">
              {{ $t(`global.back`) }}
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
      opened: false,
      currentStep: 0,
      embedHTML: '',
      currentModal: null,
      social_methods: [
        {
          name: 'copy'
        },
        {
          name: 'email',
          dataTo: ''
        },
        {
          name: 'linkedin'
        },
        {
          name: 'whatsapp'
        },
        {
          name: 'facebook'
        },
        {
          name: 'twitter'
        },
        {
          name: 'embed',
          disabled: false,
          modal: true
        }
      ]
    }
  },
  computed: {
    tipUrl() {
      return `${process.env.SITE_URL}${
        (this.$refs.modal as any).calledData.computed_slug
      }`
    },
    tipName() {
      return (this.$refs.modal as any).calledData.title
    }
  },
  watch: {
    opened(isOpen) {
      if (isOpen) {
        this.shareInit()
      }
    }
  },
  methods: {
    shareInit() {
      const vm = this

      import('@/__external/snippet').then(({ default: snippet }) => {
        vm.embedHTML = snippet((vm.$refs.modal as any).calledData.id)
      })

      // @ts-ignore
      if (navigator.share && window.Modernizr.touchevents) {
        vm.nativeShare({ url: vm.tipUrl })
        ;(vm.$refs.modal as any).close()
      } else {
        // @ts-ignore
        import('sharer.js').then(() => {
          const { Sharer } = window as any
          Sharer.init()
          // TODO
          // vm.$once('hook:beforeDestroy', () => {
          //   Sharer.destroy()
          // })
        })
      }
    },
    async nativeShare(shareData: any) {
      try {
        await (navigator as any)?.share(shareData)
      } catch (err) {}
    },
    share({ name, modal }: any) {
      const vm = this
      switch (name) {
        case 'copy': {
          vm.$copyTextToClipboard(vm.tipUrl).then(
            vm.$notification.success('copied')
          )
          break
        }
      }
      if (modal) {
        vm.currentModal = name
        vm.currentStep++
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'share-tip';
</style>
