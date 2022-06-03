<template>
  <div>
    <h1>
      {{ $t('global.api') }}
    </h1>
    <br />
    <v-table
      no-search
      no-pagination
      :columns="columns"
      :rows="rows"
      :options="options"
      @change="change"
    >
      <template v-slot:custom-field="{ data }">
        <v-input
          no-border
          :value="data.row.config_value"
          @input="handle($event, data.row.id)"
        ></v-input>
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
import debounce from 'lodash/debounce'
import { AdminMixins } from '@/plugins/vue-extend/mixins/-admin-mixins-table'
import { Api } from '@/api.config'
import { mt } from '@/store/submit'

export default AdminMixins({ getPath: Api.admin.API_SETTING_ALL }).extend({
  watchQuery: false,
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
          label: vm.$t('table.name'),
          // eslint-disable-next-line camelcase
          field: ({ config_name }: any) =>
            // eslint-disable-next-line camelcase
            vm.$t(`api.${config_name}`),
          sortable: false
        },
        {
          label: vm.$t('table.value'),
          // eslint-disable-next-line camelcase
          field: 'custom-field',
          html: true,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle(e: any, id: any) {
      const el = this.rows.find((i: any) => i.id === id)
      // eslint-disable-next-line camelcase
      const config_value = e.target.value
      if (el) {
        // eslint-disable-next-line camelcase
        el.config_value = config_value
      }
      this.save()
    },
    save: debounce(async function() {
      // @ts-ignore
      const vm = this
      try {
        await vm.$axios.put(Api.admin.API_SETTING_EDIT, {
          data: vm.rows
        })
        vm.$notification.success('update')
      } catch (e) {
        vm.$notification.error('smth')
      }
    }, Number(process.env.REQUEST_DEBOUNCE))
  }
})
</script>

<style lang="scss"></style>
