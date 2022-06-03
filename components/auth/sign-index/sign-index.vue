<template>
  <div class="g-container g-aside-container">
    <div class="index auth-aside">
      <div class="main">
        <transition name="fade" mode="out-in">
          <sign-step-0 v-if="step === 0" @changeIndex="step = $event" />
          <sign-step-1 v-if="step === 1" @changeIndex="step = $event" />
          <sign-step-2 v-if="step === 2" @changeIndex="step = $event" />
          <sign-step-3 v-if="step === 3" @changeIndex="step = $event" />
        </transition>
      </div>
      <div class="secondary">
        <div
          v-once
          class="bg"
          :style="{
            backgroundImage: `url('${$t('$i.sign-up-bg.url')}')`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SignStep0 from '@/components/auth/sign-step-0/sign-step-0.vue'
import SignStep1 from '@/components/auth/sign-step-1/sign-step-1.vue'
import SignStep2 from '@/components/auth/sign-step-2/sign-step-2.vue'
import SignStep3 from '@/components/auth/sign-step-3/sign-step-3.vue'

export default Vue.extend({
  components: {
    SignStep0,
    SignStep1,
    SignStep2,
    SignStep3
  },
  data: () => ({
    step: 0
  }),
  watch: {
    step(val) {
      if (val) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }, 1000)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/index';

.main {
  @include media-from(sm) {
    width: 52%;
  }
}

::v-deep {
  .step-pag {
    right: 0;
    top: 5px;
    font-size: 15px;
    line-height: 17px;
    color: rgba(0, 0, 0, 0.54);
  }
  .pdr-40 {
    padding-right: 40px;
  }
}
</style>
