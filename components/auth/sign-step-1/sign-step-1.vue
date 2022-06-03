<template>
  <div class="form form-info a-pr">
    <div class="a-pa step-pag a-ffr">
      {{ `${$parent.step}/3` }}
    </div>
    <h3 class="form-title a-cblack a-ffm a-mb-5">
      {{ $t('sign.personal-info') }}
    </h3>
    <div class="g-h3 a-cblack pdr-40">
      {{ $t('sign.perspective') }}
    </div>
    <div class="form-info-person a-df">
      <div class="person-media">
        <input
          ref="avatar"
          type="file"
          style="display: none;"
          @change="handleFileSelect"
        />
        <div class="photo">
          <div
            v-if="!avatarPreview"
            class="photo-default"
            :style="
              `background-image:url('${require('@/assets/images/user.png')}')`
            "
          ></div>
          <div
            v-else
            class="photo-selected"
            :style="`background-image:url('${avatarPreview}')`"
          ></div>
        </div>
        <div
          class="person-media-upload a-df a-aic"
          @click="$refs.avatar.click()"
        >
          <icon-edit-3 /> {{ $t('sign.add-photo') }}
        </div>
      </div>
      <div class="person-fields">
        <v-input
          :value="userStore.first_name"
          :error="userErrors.first_name"
          :success="validations['first_name'].state"
          name="first_name"
          type="text"
          :placeholder="$t('sign.first-name')"
          @input="handleStore"
          @keypress.enter="submit"
        />
        <v-input
          :value="userStore.last_name"
          :error="userErrors.last_name"
          :success="validations['last_name'].state"
          name="last_name"
          type="text"
          :placeholder="$t('sign.last-name')"
          @input="handleStore"
          @keypress.enter="submit"
        />
      </div>
    </div>
    <div class="a-cblack a-ffm a-mb-10 prof-info">
      {{ $t('sign.proffesional-info') }}
    </div>
    <v-input
      :value="userStore.company"
      :error="userErrors.company"
      :success="validations['company'].state"
      name="company"
      type="text"
      :placeholder="$t('sign.company')"
      @input="handleStore"
      @keypress.enter="submit"
    />
    <v-input
      :value="userStore.job_title"
      :error="userErrors.job_title"
      :success="validations['job_title'].state"
      name="job_title"
      type="text"
      :placeholder="$t('sign.job-title')"
      @input="handleStore"
      @keypress.enter="submit"
    />
    <v-select
      label="name"
      :value="selected.id ? selected : defaultSelected"
      :error="userErrors.seniority_id"
      :success="validations['seniority_id'].state"
      :options="positions"
      :searchable="false"
      @input="handleSelectStore"
    />
    <div v-if="selected && selected.count_users" class="level-users">
      {{
        levelReplace(
          $t('sign.level-label'),
          selected.count_users,
          selected.name
        )
      }}
    </div>
    <div v-if="selected && selected.count_users === 0" class="level-users">
      {{ levelReplace($t('sign.level-label-1'), null, selected.name) }}
    </div>
    <div class="a-tar--mobile">
      <fetch-loading :class="{ loading }">
        <button :disabled="loading" class="continue g-btn" @click="submit">
          {{ $t('sign.continue') }}
        </button>
      </fetch-loading>
      <span class="hint g-h3 g-h3--mobile">
        {{ $t('sign.is-member') }}
        <nuxt-link class="g-link" to="/login">
          {{ $t('sign.log-in') }}
        </nuxt-link>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mt, Auth } from '@/store/auth'
import { Api } from '@/api.config'

export default Vue.extend({
  async fetch() {
    try {
      const { data } = await this.$axios.get(Api.client.SENIORITIES)
      if (data.length) {
        this.positions = data
        this.checkInitValidations()
        this.checkSelectedLevel()
      }
    } catch (e) {
      return {}
    }
  },
  data: () => ({
    positions: [],
    selected: {},
    defaultSelected: {
      id: 0,
      name: ''
    },
    avatarPreview: '',
    file: null,
    validations: {
      first_name: {
        test: (t: String) => !!t && t.length > 1,
        state: false
      },
      last_name: {
        test: (t: String) => !!t && t.length > 1,
        state: false
      },
      company: {
        test: (t: String) => !!t && t.length > 1,
        state: false
      },
      job_title: {
        test: (t: String) => !!t && t.length > 1,
        state: false
      },
      seniority_id: {
        test: (t: String) => !!t,
        state: false
      }
    }
  }),
  computed: {
    ...mapState('auth', {
      userStore: (s) => (s as Auth).form,
      loading: (s) => (s as Auth).loading,
      userErrors: (s) => (s as Auth).errors.user
    })
  },
  methods: {
    checkSelectedLevel() {
      if (this.userStore && this.userStore.seniority_id) {
        this.selected = this.positions.find(
          (item) => item.id === this.userStore.seniority_id
        )
      } else {
        this.defaultSelected.name = this.$t('sign.choose-level')
      }
    },
    levelReplace(string, user_count, level) {
      return string.replace('{user}', user_count).replace('{level}', level)
    },
    confirmEmail() {
      const url = process.env.SNIPER_GMAIL_LINK
      window.open(url, '_blank')
      ;(this.$refs.successSignModal as any).close()
      this.redirectToHome()
    },
    redirectToHome() {
      this.$store.commit(`auth/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`auth/${mt.CLEAR_FORM_ERROR}`)
      this.$router.push('/')
    },
    handleFileSelect() {
      const vm = this
      vm.avatarPreview = vm.file = ''
      const reader = new FileReader()
      reader.readAsDataURL(vm.$refs.avatar.files[0])
      reader.onload = () => {
        vm.avatarPreview = reader.result
        vm.file = vm.$refs.avatar.files[0]
        vm.$store.commit(`auth/${mt.HANDLE_FORM_INPUT}`, {
          name: 'avatar',
          value: vm.$refs.avatar.files[0]
        })
      }
    },
    handleSelectStore(e: any) {
      this.validations.seniority_id.state = this.validations.seniority_id.test(
        e.name
      )
      this.selected = e
      /** clear errors */
      this.$store.commit(`auth/${mt.SET_FORM_ERROR}`, {
        seniority_id: ''
      })
      /** set to store */
      this.$store.commit(`auth/${mt.HANDLE_FORM_INPUT}`, {
        name: 'seniority_id',
        value: e.id
      })
    },
    handleStore(e: any) {
      this.validations[e.target.name].state = this.validations[
        e.target.name
      ].test(e.target.value)
      /** clear errors */
      this.$store.commit(`auth/${mt.SET_FORM_ERROR}`, {
        [e.target.name]: ''
      })
      /** set to store */
      this.$store.commit(`auth/${mt.HANDLE_FORM_INPUT}`, {
        name: e.target.name,
        value: e.target.value
      })
    },
    checkInitValidations(): void {
      for (const i in this.validations) {
        this.validations[i].state = this.validations[i].test(this.userStore[i])
      }
    },
    async submit() {
      this.$store.dispatch('auth/loading', true)
      try {
        const data = new FormData()
        for (const i in this.userStore) {
          data.append(i, this.userStore[i])
        }
        const status = await this.$axios.post(
          Api.client.SIGN_UP_STEP_TWO_VALIDATION,
          data
        )
        if (status) {
          this.$store.dispatch('auth/loading', false)
          this.$emit('changeIndex', 2)
        }
      } catch (e) {
        this.$store.dispatch('auth/loading', false)
        this.$store.commit(`auth/${mt.SET_FORM_ERROR}`, e.response.data)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/form';
</style>
