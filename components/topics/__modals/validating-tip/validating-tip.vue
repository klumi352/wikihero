<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    key="validating-tip"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="validating-tip"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <!-- FOR NO_LOGGED USER -->
        <div class="content">
          <h2>
            {{ $t('modal-valid.head-no-logged') }}
          </h2>

          <br />

          <div class="a-mw700px">
            <div class="g-h2 a-cb">
              {{
                isLevelUp
                  ? $t('modal.level-up', {
                      level: level.level
                    })
                  : $t('modal.earn', {
                      count: level.count_points
                    })
              }}
            </div>
            <div class="g-h3">
              <i18n path="modal.save-message" tag="span">
                <template #sign>
                  <nuxt-link
                    class="g-link"
                    :to="`/signup/?redirect=${$route.path}`"
                    >{{ $t('modal.sign-part') }}</nuxt-link
                  >
                </template>
                <template #logging>
                  <nuxt-link
                    class="g-link"
                    :to="`/login/?redirect=${$route.path}`"
                    >{{ $t('modal.logging-part') }}</nuxt-link
                  >
                </template>
              </i18n>
            </div>
          </div>

          <br />

          <v-status />

          <div class="a-mw500px">
            <br />
            <div v-html="$t('modal-valid.intro-no-logged')"></div>
            <br />
            <div class="a-tar--mobile btn__wrap">
              <button class="g-btn btn__mrg" @click="() => $refs.modal.close()">
                {{ $t('global.close') }}
              </button>
              <nuxt-link
                class="g-btn g-btn--fill"
                :to="`/signup/?redirect=${$route.path}&reward=1`"
                @click.native="
                  $analytic.trackers.goalRegistration.redirectFromReward()
                "
              >
                {{ $t('modal.get-points-btn') }}
              </nuxt-link>
            </div>
            <div class="a-ffr a-fz-12-14">
              {{ $t('modal.once-submit') }}
            </div>
          </div>
        </div>
        <img
          class="pic"
          :src="
            isLevelUp ? $t('$i.level-up.url') : $t('$i.success-non-logged.url')
          "
        />
      </v-step>
      <!-- --- -->
      <v-step>
        <!-- FOR LOGGED USER -->
        <div class="content">
          <h2>
            {{ $t('modal-valid.head-loged') }}
          </h2>
          <br />
          <div class="a-mw700px">
            <h2 class="a-cb">
              {{
                isLevelUp
                  ? $t('modal.level-up', {
                      level: level.level
                    })
                  : $t('modal.earn', {
                      count: level.count_points
                    })
              }}
            </h2>
            <v-status />
          </div>
          <br />
          <div class="a-mw600px">
            <div class="g-h3 a-mw400px">
              {{ $t('modal-valid.placeholder') }}
            </div>
            <v-textarea
              :value="form.comment"
              :error="errors.comment"
              name="comment"
              @input="handle"
            />
            <div class="a-tar--mobile">
              <button class="g-btn g-btn--fill" @click="sendRequest">
                {{ $t('global.confirm') }}
              </button>
            </div>
            <div class="a-ffr a-fz-12-14">
              {{ $t('modal.once-submit') }}
            </div>
          </div>
        </div>
        <img
          class="pic"
          :src="isLevelUp ? $t('$i.level-up.url') : $t('$i.success-vote.url')"
        />
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
      currentStep: null
    } as any
  },
  computed: {
    ...mapState('topic', ['topic']),
    ...mapState('auth', ['level']),
    ...mapState('submit', ['form', 'loading', 'errors']),
    ...mapGetters('auth', ['loggedIn', 'isLevelUp'])
  },
  watch: {
    opened(isOpen) {
      if (isOpen) {
        this.currentStep = this.loggedIn ? 1 : 0
        this.handle({
          target: {
            name: 'tip_id',
            value: (this.$refs.modal as any).calledData
          }
        })
      } else {
        this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
        this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      }
    }
  },
  methods: {
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
          method: 'put',
          path: Api.client.TIP_ATTACH_COMMENT(
            (this.$refs.modal as any).calledData
          ),
          withRecaptcha: true
        })
        .then(() => {
          ;(this.$refs.modal as any).close()
        })
        .catch((e: any) => {
          // eslint-disable-next-line no-console
          console.error(e)
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'validating-tip';
</style>
