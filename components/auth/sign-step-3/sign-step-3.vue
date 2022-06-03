<template>
  <div class="form form-info a-pr">
    <div class="a-pa step-pag a-ffr">
      {{ `${$parent.step}/3` }}
    </div>
    <h3 class="form-title a-cblack a-ffm a-mb-10-20">
      {{ $t('sign.step-3-title') }}
    </h3>
    <div class="g-h3 a-cblack pdr-40">
      {{ $t('sign.step-3-sub') }}
    </div>
    <div class="step-cards">
      <div class="txt a-ffr">
        {{ $t('sign.step-3-cards-title') }}
        <a class="g-link" target="_blank" href="/code-of-conduct">
          {{ $t('sign.step-3-code-product') }}
        </a>
      </div>
      <div class="a-df step-cards-row">
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-1') }}
            </div>
          </div>
        </div>
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-2') }}
            </div>
          </div>
        </div>
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-3') }}
            </div>
          </div>
        </div>
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-4') }}
            </div>
          </div>
        </div>
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-5') }}
            </div>
          </div>
        </div>
        <div class="step-cards-item a-pr">
          <div class="item-wrap a-pa a-df">
            <div class="item-txt a-tac a-ffr">
              {{ $t('sign.step-3-card-6') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="a-mt-30-50">
      <v-controll
        :error="validations.conduct.state ? $t('errors.required-checkbox') : ''"
        class="a-m0 a-mb-5"
        type="checkbox"
        name="terms"
        :checked="conditions.conduct"
        @input="conditionHandler($event, 'conduct')"
      >
        <span class="hint g-h3 a-p0">
          {{ $t('sign.step-3-agree') }}
          <a class="g-link" target="_blank" href="/code-of-conduct">
            {{ $t('sign.step-3-code-product') }}
          </a>
        </span>
      </v-controll>
      <v-controll
        :error="validations.terms.state ? $t('errors.required-checkbox') : ''"
        class="a-m0"
        type="checkbox"
        name="conduct"
        :checked="conditions.terms"
        @input="conditionHandler($event, 'terms')"
      >
        <span class="hint g-h3 a-p0">
          {{ $t('sign.step-3-agree') }}
          <a class="g-link" href="/terms" target="_blank">
            {{ $t('sign.step-3-terms') }}
          </a>
        </span>
      </v-controll>
    </div>
    <div class="a-df a-jcsb a-mt-30-60">
      <button class="g-btn" @click="$emit('changeIndex', 2)">
        {{ $t('sign.previous') }}
      </button>
      <fetch-loading :class="{ loading }">
        <button class="g-btn g-btn--fill" @click="submit">
          {{ $t('sign.continue') }}
        </button>
      </fetch-loading>
    </div>
    <div>
      <span class="hint g-h3 g-h3--mobile">
        {{ $t('sign.is-member') }}
        <nuxt-link class="g-link" to="/login">{{
          $t('sign.log-in')
        }}</nuxt-link></span
      >
    </div>
    <modal-view
      key="success-sign"
      ref="successSignModal"
      v-slot="{ isOpen }"
      name="success-sign"
      no-close
    >
      <transition name="fade" mode="out-in">
        <div v-if="isOpen && !registered">
          <h3 class="a-ffm a-cblack a-fz-23-27">
            {{ $t('sign.process-creating') }}
          </h3>
          <div class="a-df a-jcc a-mt-20-40">
            <img class="loading" src="~assets/svg/icon-preloader.svg" alt="" />
          </div>
        </div>
        <div v-if="isOpen && registered" class="form__email-confirmation">
          <button
            :title="$t('modal.close')"
            class="form__fixed-close g-t-btn"
            @click="closeSuccessWindow"
          >
            <icon-close width="15" height="15" />
          </button>
          <h3 class="a-ffm a-cblack a-fz-23-27 a-mb-0">
            {{ $t('sign.process-success') }}
          </h3>
          <div class="a-mb-40-80">
            {{ $t('sign.confirm-email') }}
          </div>
          <div v-if="mode === 'gmail'">
            <button class="g-btn" @click="confirmEmail">
              {{ $t('sign.sniper-confirm') }}
            </button>
          </div>
          <div v-else>
            <div
              v-html="
                $t('sign.basic-intro', {
                  'basic-link': `<a class='g-link' href='mailto:${userStore.email}'>${userStore.email}</a>`
                })
              "
            ></div>
          </div>
        </div>
      </transition>
    </modal-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mt } from '@/store/auth'

export default {
  data: () => ({
    registered: false,
    mode: null,
    conditions: {
      terms: false,
      conduct: false
    },
    validations: {
      terms: {
        test: (t) => !!t,
        state: false
      },
      conduct: {
        test: (t) => !!t,
        state: false
      }
    }
  }),
  computed: {
    ...mapState('auth', {
      userStore: (s) => s.form,
      loading: (s) => s.loading
    })
  },
  methods: {
    conditionHandler(e, type) {
      this.validations[type].state = false
      this.conditions[type] = e.target.checked
    },
    checkValidations() {
      for (const i in this.validations) {
        this.validations[i].state = this.validations[i].test(
          !this.conditions[i]
        )
      }
      return this.conditions.terms && this.conditions.conduct
    },
    confirmEmail() {
      const url = process.env.SNIPER_GMAIL_LINK
      window.open(url, '_blank')
      this.$refs.successSignModal.close()
      this.redirectToHome()
    },
    redirectToHome() {
      this.$store.commit(`auth/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`auth/${mt.CLEAR_FORM_ERROR}`)
      this.$router.push('/')
    },
    closeSuccessWindow() {
      this.redirectToHome()
      this.$refs.successSignModal.close()
    },
    submit() {
      if (!this.checkValidations()) return
      const isGmailAndDesktop =
        this.userStore.email?.endsWith('gmail.com') &&
        // @ts-ignore
        !window.Modernizr.touchevents
      this.$refs.successSignModal.open()
      this.$store
        .dispatch(`auth/register`)
        .then(() => {
          this.registered = true
          if (isGmailAndDesktop) {
            this.mode = 'gmail'
            this.$refs.successSignModal.open()
          } else {
            this.mode = 'basic'
            this.$refs.successSignModal.open()
          }
        })
        .catch(() => {
          this.$refs.successSignModal.close()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/form';

.step-cards {
  margin-top: 35px;

  .txt {
    font-size: 15px;
    line-height: 17px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.54);
  }

  &-row {
    margin: 0 -2.5px;
    flex-wrap: wrap;
  }

  &-item {
    margin: 0 2.5px 13px;
    width: calc(33.33333% - 5px);
    border-radius: 3px;
    padding-bottom: 24%;
    background: rgba(226, 226, 226, 0.5);

    @include media-to(md) {
      width: calc(50% - 5px);
    }

    @include media-to(xs-min) {
      width: calc(100% - 5px);
      padding-bottom: 30%;
    }

    .item-wrap {
      height: 100%;
      padding: 8px 11px;
      left: 0;
      top: 0;
      width: 100%;
      align-items: flex-end;
    }

    .item-txt {
      min-height: 50px;
      font-size: 15px;
      line-height: 17px;
      color: var(--c-black);
      width: 100%;
    }
  }
}
</style>
