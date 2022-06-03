<template>
  <div>
    <h1>
      {{ $t('global.images') }}
    </h1>
    <v-stepper ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step visible>
        <div class="a-df a-jcsb a-aic">
          <button
            :title="$t('admin.create-image')"
            class="g-btn g-btn--link"
            @click="currentStep++"
          >
            <icon-plus width="12" height="12" />&nbsp;{{
              $t('admin.create-image')
            }}
          </button>
          <button
            :title="$t('global.sync')"
            class="g-t-btn"
            @click="$store.dispatch('translations/syncImages')"
          >
            <icon-refresh width="25" height="25" />
          </button>
        </div>
      </v-step>
      <v-step>
        <v-input
          :value="form.image_key"
          :error="errors.image_key"
          :disabled="isProd && currentEdit"
          name="image_key"
          placeholder="Image key"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <v-input
          :value="form.alt"
          :error="errors.alt"
          name="alt"
          class="a-fg"
          placeholder="Alt"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <button class="g-btn" @click="currentStep--">
          {{ $t('global.back') }}
        </button>
        <button class="g-btn g-btn--fill" @click="sendRequest">
          {{ $t('global.save') }}
        </button>
        <button
          class="g-t-btn"
          :class="{ 'g-with-dot': form.image }"
          @click="upload"
        >
          <icon-upload width="25" height="25" />
        </button>
      </v-step>
    </v-stepper>
    <v-table
      :columns="columns"
      :rows="rows"
      :options="options"
      @change="change"
    >
      <template v-slot:actions="{ data }">
        <button class="g-t-btn" @click="edit(data.row)">
          <icon-edit-2 class="btn-edit" width="20" height="20" />
        </button>
        <button class="g-t-btn" @click="del(data.row.id)">
          <icon-delete width="20" height="20" />
        </button>
      </template>
    </v-table>
  </div>
</template>

<script lang="ts">
/**
 * ALL METHODS IS THERE
 */
/* eslint-disable no-unreachable */
import { mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default AdminMixins({ getPath: Api.admin.IMAGE_ALL }).extend({
  watchQuery: false,
  inject: ['isProd'],
  data() {
    const vm = this as any
    return {
      currentStep: 0,
      currentEdit: null,
      columns: [
        {
          label: vm.$t('table.id'),
          field: 'id',
          sortable: false
        },
        {
          label: vm.$t('table.key'),
          field: 'image_key',
          sortable: false
        },
        {
          label: vm.$t('table.name'),
          field: 'origin_name',
          sortable: false
        },
        {
          label: vm.$t('table.alt'),
          field: 'alt',
          sortable: false
        },
        {
          label: vm.$t('table.image'),
          width: '100px',
          // eslint-disable-next-line camelcase
          field: ({ path_to_image }: any) =>
            // eslint-disable-next-line camelcase
            `<img class="g-table-image" src="${path_to_image}"/>`,
          html: true,
          sortable: false
        },
        {
          label: vm.$t('table.actions'),
          field: 'actions',
          width: '80px',
          sortable: false
        }
      ]
    }
  },
  watch: {
    currentStep(value) {
      if (!value) {
        this.currentEdit = null
        this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
        this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
      }
    }
  },
  computed: {
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  methods: {
    del(id: any) {
      const vm = this as any
      if (!confirm(vm.$t('modal.are-you-sure'))) return
      vm.$axios.delete(Api.admin.IMAGE_DELETE(id)).then(() => {
        vm.refresh()
      })
    },
    edit(value: any) {
      window.scrollTo(0, 0)
      this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
      this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)

      this.currentStep++
      this.currentEdit = value.id
      this._handle('image_key', value.image_key)
      this._handle('alt', value.alt)
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
    upload() {
      const file = document.createElement('input')
      file.oninput = () => {
        // eslint-disable-next-line camelcase
        const [curr_file] = file.files as any
        this._handle('image', curr_file)
      }
      file.type = 'file'
      file.click()
    },
    sendRequest(): void {
      const vm = this
      const stepper: any = this.$refs.stepper
      const path = this.currentEdit
        ? Api.admin.IMAGE_EDIT(this.currentEdit)
        : Api.admin.IMAGE_CREATE

      stepper.loading().show()
      this.$store
        .dispatch(`submit/send`, { path, asFormData: true })
        .then(() => {
          this.currentStep--
          this.refresh()
          vm.$notification.success('update')
        })
        .catch((errors: any) => {
          if (errors?.image) {
            vm.$notification.error('smth')
          }
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss"></style>
