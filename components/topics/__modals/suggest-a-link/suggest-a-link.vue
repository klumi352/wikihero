<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    key="suggest-a-link"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="suggest-a-link"
    @opened="opened = true"
    @closed="
      currentStep = 0
      opened = false
    "
  >
    <v-stepper v-if="isOpen" ref="stepper" v-model="currentStep" no-overflow>
      <v-step>
        <h2>{{ $t('modal-suggest.head') }}</h2>
        <div class="a-mw600px">
          <v-input
            :value="form.url"
            :error="errors.url"
            name="url"
            :placeholder="$t('modal-suggest.1st-pl')"
            :hint="$t('modal-suggest.1st-hint')"
            @input="handle"
            @keypress.enter="sendRequest"
          />
          <div class="a-tar--mobile">
            <button class="g-btn" @click="sendRequest">
              {{ $t('global.confirm') }}
            </button>
          </div>
          <div class="a-ffr a-fz-12-14">
            {{ $t('modal.once-submit') }}
          </div>
        </div>
      </v-step>
      <v-step>
        <!-- 
        FOR NO_LOGGED USER 
        -->
        <div class="content">
          <h2>
            {{ $t('modal-suggest.head-no-log') }}
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
            <br />
            <v-status />
          </div>
          <div class="a-mw500px">
            <br />
            <div v-html="$t('modal-suggest.intro-no-log')"></div>
            <br />
            <div class="a-tar--mobile">
              <button class="g-btn" @click="() => $refs.modal.close()">
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
          alt=""
        />
      </v-step>
      <!-- --- -->
      <v-step>
        <!-- 
        FOR LOGGED USER 
        -->
        <div class="content">
          <h2>
            {{ $t('modal-suggest.head-log') }}
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
          <div class="space a-mw600px">
            <div class="a-tar--mobile">
              <button class="g-btn" @click="() => $refs.modal.close()">
                {{ $t('global.close') }}
              </button>
            </div>
            <div class="a-ffr a-fz-12-14">
              {{ $t('modal.once-submit') }}
            </div>
          </div>
        </div>
        <img
          class="pic"
          :src="isLevelUp ? $t('$i.level-up.url') : $t('$i.success-link.url')"
          alt=""
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
import { mt as mtSubmit } from '@/store/submit'
import { mt as mtAuth } from '@/store/auth'

export default Vue.extend({
  data() {
    return {
      opened: false,
      currentStep: 0
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
        this.handle({
          target: {
            name: 'tip_id',
            value: (this.$refs.modal as any).calledData
          }
        })
      } else {
        this.$store.commit(`submit/${mtSubmit.CLEAR_FORM_INPUT}`)
        this.$store.commit(`submit/${mtSubmit.CLEAR_FORM_ERROR}`)
      }
    }
  },
  methods: {
    handle(e: any) {
      /** clear errors */
      this.$store.commit(`submit/${mtSubmit.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`submit/${mtSubmit.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    sendRequest(): void {
      const stepper: any = this.$refs.stepper
      stepper.loading().show()

      this.$store
        .dispatch(`submit/send`, {
          path: Api.client.TIP_LINK_CONTRIBUTE,
          withRecaptcha: true
        })
        .then((data: any) => {
          this.$store.commit(`auth/${mtAuth.SET_USER_LEVEL}`, data.points)
          this.currentStep++
          this.$analytic.trackers['suggest-link']()
          // show 3rd step
          this.loggedIn && this.currentStep++
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
@import 'suggest-a-link';
</style>
