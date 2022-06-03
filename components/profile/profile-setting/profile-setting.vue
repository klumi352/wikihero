<template>
  <div class="profile-setting">
    <!-- additionals from phase 2 - start -->
    <div class="personal">
      <span class="profile-title a-ffr">{{
        $t('setting.picture-field-name')
      }}</span>
    </div>
    <div class="user__avatar-wrap">
      <div class="user__avatar-limit-wrap">
        <div class="user__avatar-subwrap">
          <div class="user__preloader" :class="preload ? 'show-loader' : ''">
            <img
              class="ico"
              width="60"
              height="60"
              src="~assets/svg/icon-preloader.svg"
              alt=""
            />
          </div>
          <img
            :src="data.profile.avatar.original_url"
            alt=""
            class="user__avatar"
          />
          <label>
            <button
              class="user__edit-btn g-btn g-btn--fill a-ffr"
              @click="callInput"
            >
              <icon-edit class="user__edit-ico"></icon-edit>
              {{ $t('setting.edit-text') }}
            </button>
            <!-- input type file -->
            <input
              ref="hiddenInput"
              class="user__edit-input"
              type="file"
              src=""
              alt=""
              @change="showPhoto"
            />
          </label>
          <!-- input type file -->
        </div>
      </div>
    </div>
    <!-- additionals from phase 2 - finish -->
    <div class="personal">
      <span class="profile-title a-ffr">{{
        editMode ? $t('setting.personal-edit') : $t('setting.personal')
      }}</span>
      <button
        class="g-btn g-btn--dark"
        :disabled="currentStep === 1"
        @click="editMode ? sendRequest() : (editMode = true)"
      >
        {{ editMode ? $t('global.save') : $t('global.edit') }}
      </button>
    </div>
    <v-stepper ref="stepper" v-model="currentStep" no-overflow>
      <!-- --- -->
      <v-step>
        <div class="block" :class="{ editMode }">
          <form autocomplete="off">
            <v-input
              :value="form.first_name"
              :error="errors.first_name"
              name="first_name"
              :placeholder="$t('setting.name-placeholder')"
              :hint="$t('setting.name-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <!-- additionals from phase 2 - start -->
            <v-input
              :value="form.last_name"
              :error="errors.last_name"
              name="last_name"
              :placeholder="$t('setting.surname-placeholder')"
              :hint="$t('setting.surname-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <v-input
              :value="form.company"
              :error="errors.company"
              name="company"
              :placeholder="$t('setting.company-placeholder')"
              :hint="$t('setting.company-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <!-- additionals from phase 2 - finish -->
            <v-input
              :value="form.email"
              :error="errors.email"
              name="email"
              type="email"
              :placeholder="$t('setting.email-placeholder')"
              :hint="$t('setting.email-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <!-- additionals from phase 2 - start -->
            <v-input
              :value="form.job_title"
              :error="errors.job_title"
              name="job_title"
              :placeholder="$t('setting.job-title-placeholder')"
              :hint="$t('setting.job-title-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <span class="profile-setting__seniority-title a-ffr">{{
              $t('profile.seniority-title')
            }}</span>
            <v-select
              label="name"
              :value="selected.id ? selected : defaultSelected"
              :options="positions"
              class="profile-setting__seniority-input"
              @input="handleSelectStore"
            />
            <!-- additionals from phase 2 - finish -->
            <v-password
              :value="form.password"
              :error="errors.password"
              autocomplete="off"
              name="password"
              :placeholder="$t('setting.pass-placeholder')"
              :hint="$t('setting.pass-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
            <v-password
              v-show="form.password || form.password_confirmation"
              :value="form.password_confirmation"
              :error="errors.password_confirmation"
              name="password_confirmation"
              :placeholder="$t('setting.cpass-placeholder')"
              :hint="$t('setting.cpass-hint')"
              @input="handle"
              @keypress.enter="sendRequest"
            />
          </form>
        </div>
      </v-step>
      <!-- --- -->
      <v-step>
        <h3>{{ $t('setting.success-change') }}</h3>
      </v-step>
      <!-- --- -->
    </v-stepper>
    <modal-view
      key="change-email-message"
      ref="changeEmail"
      name="change-email-message"
    >
      <h2>Change email!</h2>
    </modal-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'
import IconEdit from '@/chunk/__svg/icon-edit-3.svgm'

export default Vue.extend({
  components: {
    IconEdit
  },
  async fetch() {
    try {
      const { data } = await this.$axios.get(Api.client.SENIORITIES)
      if (data.length) {
        this.positions = data
        this.checkSelectedLevel()
      }
    } catch (e) {
      return {}
    }
  },
  data() {
    return {
      currentStep: 0,
      startEmail: null,
      editMode: false,
      file: null,
      preload: false,
      positions: [],
      selected: {},
      defaultSelected: {
        id: 0,
        name: ''
      }
    }
  },
  computed: {
    ...mapState('profile', ['data']),
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  created() {
    const h = (name: any, value: any) =>
      this.handle({ target: { name, value } })

    h('original_url', this.data.profile.avatar.original_url)
    h('name', this.data.name)
    h('email', this.data.email)
    h('personal_info', this.data.personal_info)
    h('first_name', this.data.profile.first_name)
    h('last_name', this.data.profile.last_name)
    h('company', this.data.profile.company)
    h('job_title', this.data.profile.job_title)
    h('job_type', '')
    h('seniority_id', this.data.profile.seniority?.id)
    this.startEmail = this.data.email
  },
  methods: {
    callInput() {
      this.$refs.hiddenInput.click()
    },
    async showPhoto() {
      const vm = this
      const fileInp = vm.$refs.hiddenInput
      if (!fileInp.value) return
      // eslint-disable-next-line no-useless-catch
      try {
        vm.preload = true
        const [file] = fileInp.files
        const formData = new FormData()
        formData.append('avatar', file)
        const { data } = await this.$axios.post('user/upload-avatar', formData)
        vm.$store.commit('profile/SET_AVATAR', data.original_url)
      } catch (e) {
        vm.$notification.error('smth')
      } finally {
        setTimeout(() => {
          vm.preload = false
        }, 300)
      }
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
    handleSelectStore(e: any) {
      this.selected = e
      /** clear errors */
      this.$store.commit(`submit/${mt.SET_FORM_ERROR}`, {
        seniority_id: ''
      })
      /** set to store */
      this.$store.commit(`submit/${mt.HANDLE_FORM_INPUT}`, {
        name: 'seniority_id',
        value: e.id
      })
    },
    checkSelectedLevel() {
      if (
        this.data &&
        this.data.profile &&
        this.data.profile.seniority &&
        this.data.profile.seniority.id
      ) {
        this.selected = this.positions.find(
          (item) => item.id === this.data.profile.seniority.id
        )
      } else {
        this.defaultSelected.name = this.$t('sign.choose-level')
      }
    },
    sendRequest(): void {
      const stepper: any = this.$refs.stepper
      stepper.loading().show()
      Promise.all([
        this.$store.dispatch(`submit/send`, {
          path: Api.client.USER_SETTING,
          method: 'put'
        }),
        this.$store.dispatch(`submit/send`, {
          path: '/user/profile',
          method: 'post'
        })
      ])
        .then(() => {
          this.currentStep++
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        .catch((e) => {
          this.currentStep = 0
          throw e
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'profile-setting';
</style>
