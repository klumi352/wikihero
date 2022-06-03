<template>
  <div>
    <h1>
      {{ $t('global.levels') }}
    </h1>
    <br />
    <v-stepper ref="stepper">
      <div v-for="(item, key) in data" :key="key" class="inps">
        <div class="g-h2 level">{{ key + 1 }}</div>
        <div class="inp">
          <v-input
            v-if="key > 0"
            type="number"
            placeholder="From points"
            no-error-text
            highlight-error
            :error="data[key].error"
            :value="data[key].point_from"
            :highlight="item.highlight_from"
            @focus="setHighlight(key)"
            @blur="checkErrors"
            @input="handleMin($event, key)"
          ></v-input>
          <v-input
            v-else
            type="number"
            placeholder="From points"
            value="0"
            disabled
          ></v-input>
        </div>
        <div class="inp">
          <v-input
            v-if="key < data.length - 1"
            type="number"
            placeholder="To points"
            no-error-text
            highlight-error
            :error="data[key].error"
            :highlight="item.highlight_to"
            :value="data[key + 1] ? data[key + 1].point_from : item.point_to"
            @focus="setHighlight(key, true)"
            @blur="checkErrors"
            @input="handleMax($event, key)"
          ></v-input>
          <v-input
            v-else
            type="string"
            placeholder="To points"
            value="Infinite"
            disabled
          ></v-input>
        </div>
        <button class="g-t-btn" :disabled="!item.id" @click="upload(item.id)">
          <div v-if="item.path_to_image">
            <img :src="item.path_to_image" class="img" width="40" height="40" />
          </div>
          <div v-else>
            <icon-upload width="25" height="25" />
          </div>
        </button>
        <button :disabled="data.length < 3" class="g-t-btn" @click="del(key)">
          <icon-delete width="25" height="25" />
        </button>
      </div>
      <br />
      <button :disabled="false" class="g-btn" @click="create">
        {{ $t('global.create') }}
      </button>
      <button :disabled="false" class="g-btn g-btn--fill" @click="save">
        {{ $t('global.save') }}
      </button>
    </v-stepper>
  </div>
</template>

<script lang="ts">
/**
 * ALL METHODS IS THERE
 */
/* eslint-disable no-unreachable */
import get from 'lodash/get'
import cd from 'lodash/cloneDeep'
import Vue from 'vue'
import { mapState } from 'vuex'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default Vue.extend({
  async asyncData({ $axios }) {
    const r: any = await $axios.get(Api.admin.LEVEL_ALL)
    r.data.forEach((i: any) => {
      i.error = ''
      i.highlight_to = false
      i.highlight_from = false
    })
    return {
      data: r.data
    }
  },
  data() {
    // const vm = this as any
    return {
      highlight: false,
      currentStep: 0,
      currentEdit: null
    }
  },
  computed: {
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  watch: {
    currentStep(value) {
      if (!value) {
        this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
        this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      }
    }
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  methods: {
    upload(id: any) {
      const vm = this as any
      if (!confirm(vm.$t('admin.confirm-attach'))) return

      const stepper = vm.$refs.stepper
      stepper.loading().show()
      const file = document.createElement('input')
      file.oninput = () => {
        document.body.onfocus = function() {
          stepper.loading().hide()
          document.body.onfocus = null
        }

        const formdata = new FormData()
        // eslint-disable-next-line camelcase
        const [curr_file] = file.files as any
        formdata.append('id', id)
        formdata.append('image', curr_file)
        this.$axios
          .post(Api.admin.LEVEL_ATTACH_IMAGE, formdata)
          .then(({ data }) => {
            vm.data.find((i: any) => i.id === id).path_to_image =
              data.path_to_image
            delete file.oninput
          })
          .catch(() => {})
      }
      file.type = 'file'
      file.click()
    },
    async setHighlight(k: number, isRight: boolean) {
      const vm = this as any
      await Promise.resolve()

      const type = isRight ? 'to' : 'from'
      vm.data[k][`highlight_${type}`] = true
      if (isRight) get(vm.data, k + 1, {}).highlight_from = true
      else get(vm.data, k - 1, {}).highlight_to = true
    },
    create() {
      const vm = this as any
      const lastEl = vm.data[vm.data.length - 1]
      // eslint-disable-next-line camelcase
      const { point_from } = lastEl
      // eslint-disable-next-line camelcase
      lastEl.point_to = point_from + 100

      vm.data.push({
        id: null,
        // eslint-disable-next-line camelcase
        point_from: lastEl.point_to,
        point_to: null
      })
    },
    async save() {
      const vm = this as any
      const data = cd(vm.data)

      /** Infinity level */
      data[0].point_from = 0
      data[data.length - 1].point_to = null

      try {
        if (vm.checkErrors()) throw new Error('IS_ERROR')
        await this.$axios.post(Api.admin.LEVEL_EDIT, { data })
        this.$router.go(0)
        this.$notification.success('update')
      } catch (e) {
        this.$notification.error('smth')
      }
    },
    del(key: number) {
      const vm = this as any
      const isOperation = key > 0 && key < vm.data.length - 1
      vm.data.splice(key, 1)
      if (isOperation) {
        vm.data[key - 1].point_to = vm.data[key].point_from
      }
    },
    checkErrors() {
      const vm = this as any
      let errorCount = 0
      vm.data.forEach((i: any, index: number) => {
        const isLast = index === vm.data.length - 1
        i.highlight_to = false
        i.highlight_from = false
        if (
          (!isLast && i.point_from >= i.point_to) ||
          isNaN(i.point_from) ||
          isNaN(i.point_to) /* || errorCount */
        ) {
          i.error = 'on'
          errorCount++
        } else {
          i.error = ''
        }
      })
      return Boolean(errorCount)
    },
    handleMin($event: any, key: any) {
      const vm = this as any
      vm.data[key].point_from = parseInt($event.target.value)
      if (vm.data[key - 1]) {
        vm.data[key - 1].point_to = parseInt($event.target.value)
      }
    },
    handleMax($event: any, key: any) {
      const vm = this as any
      vm.data[key].point_to = parseInt($event.target.value)
      if (vm.data[key + 1]) {
        vm.data[key + 1].point_from = parseInt($event.target.value)
      }
    },
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
      const method = this.currentEdit ? 'put' : 'post'
      const path = this.currentEdit
        ? Api.admin.TRANSLATION_EDIT(this.currentEdit)
        : Api.admin.TRANSLATION_CREATE

      stepper.loading().show()
      this.$store
        .dispatch(`submit/send`, { method, path })
        .then(() => {
          this.currentStep--
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
@import 'levels.scss';
</style>
