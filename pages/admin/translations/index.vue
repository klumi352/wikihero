<template>
  <div>
    <h1>
      {{ $t('global.translations') }}
    </h1>
    <v-stepper ref="stepper" v-model="currentStep">
      <!-- --- -->
      <v-step visible>
        <div class="a-df a-jcsb a-aic">
          <button
            :title="$t('admin.create-trans')"
            class="g-btn g-btn--link"
            @click="create"
          >
            <icon-plus width="12" height="12" />&nbsp;{{
              $t('admin.create-trans')
            }}
          </button>
          <button
            :title="$t('global.sync')"
            class="g-t-btn"
            @click="$store.dispatch('translations/syncTranslations')"
          >
            <icon-refresh width="25" height="25" />
          </button>
        </div>
      </v-step>
      <v-step>
        <v-input
          :value="form.translation_key"
          :error="errors.translation_key"
          :disabled="isProd && currentEdit"
          name="translation_key"
          placeholder="Type key"
          @input="handle"
          @keypress.enter="sendRequest"
        />
        <v-textarea
          :value="form.translation_value"
          :error="errors.translation_value"
          name="translation_value"
          placeholder="Type value"
          @input="handle"
        />
        <button class="g-btn" @click="currentStep--">
          {{ $t('global.back') }}
        </button>
        <button class="g-btn g-btn--fill" @click="sendRequest">
          {{ $t('global.save') }}
        </button>
      </v-step>
    </v-stepper>
    <!-- --- -->
    <!-- FILTER -->
    <div>
      <br />
      <button
        v-for="key in filterKeys"
        :key="key"
        class="g-btn-mini"
        :class="{ active: filterKey === key }"
        @click="setFilterKey(key)"
      >
        {{ key }}
      </button>
    </div>
    <!-- --- -->
    <br />
    <v-table
      no-search
      no-pagination
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
// @ts-ignore
import { mapState } from 'vuex'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default AdminMixins({ getPath: Api.admin.TRANSLATION_ALL }).extend({
  watchQuery: false,
  inject: ['isProd'],
  data() {
    const vm = this as any
    return {
      filterKey: this.$route.query.module || null,
      currentStep: 0,
      currentEdit: null,
      columns: [
        {
          label: vm.$t('table.key'),
          field: 'translation_key',
          width: '220px',
          sortable: false
        },
        {
          label: vm.$t('table.value'),
          field: 'translation_value',
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
    filterKeys() {
      const vm = this as any
      return [
        ...new Set(
          vm.protectRows
            .map((i: any) => i.translation_key.match(/[^.]*/i)[0])
            .sort((a: string, b: string) => a.localeCompare(b))
        )
      ]
    },
    ...mapState('submit', ['form', 'loading', 'errors'])
  },
  beforeDestroy() {
    this.$store.commit(`submit/${mt.CLEAR_FORM_INPUT}`)
    this.$store.commit(`submit/${mt.CLEAR_FORM_ERROR}`)
  },
  methods: {
    create() {
      this.currentStep++
      this.filterKey && this._handle('translation_key', `${this.filterKey}.`)
    },
    setFilterKey(key: any) {
      const vm = this
      this.currentEdit = null

      if (vm.filterKey === key) {
        vm.filterKey = null
        vm.$router.replace({ query: {} })
        if (vm.currentStep === 1) {
          vm._handle('translation_key', '')
        }
      } else {
        if (vm.currentStep === 1) {
          vm._handle('translation_key', `${key}.`)
        }
        vm.$router.replace({
          query: {
            module: key
          }
        })
        vm.filterKey = key
      }
    },
    filterFunction(data: any[]) {
      const vm = this
      if (vm.filterKey) {
        return data.filter((i) =>
          i.translation_key.startsWith(`${vm.filterKey}.`)
        )
      } else {
        return data
      }
    },
    del(id: any) {
      const vm = this as any
      if (!confirm(vm.$t('modal.are-you-sure'))) return
      vm.$axios.delete(Api.admin.TRANSLATION_DELETE(id)).then(() => {
        vm.refresh()
      })
    },
    edit(value: any) {
      window.scrollTo(0, 0)
      this.currentStep++
      this.currentEdit = value.id
      this._handle('translation_key', value.translation_key)
      this._handle('translation_value', value.translation_value)
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
          this.refresh()
          this.$notification.success('update')
        })
        .catch(() => {
          this.$notification.error('smth')
        })
        .finally(() => {
          stepper.loading().hide()
        })
    }
  }
})
</script>

<style lang="scss"></style>
