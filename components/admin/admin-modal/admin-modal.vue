<template>
  <!-- eslint-disable vue/no-v-html -->
  <modal-view
    ref="modal"
    key="admin-modal"
    name="admin-modal"
    @opened="opened = true"
    @closed="opened = false"
  >
    <v-table
      v-if="opened"
      no-text-shorter
      no-pagination
      no-search
      :columns="[
        {
          label: $t('table.name'),
          field: 'name',
          sortable: false
        },
        {
          label: $t('table.value'),
          field: 'value',
          sortable: false
        }
      ]"
      :rows="localData"
    >
    </v-table>
  </modal-view>
</template>

<script lang="ts">
import Vue from 'vue'
import get from 'lodash/get'

export default Vue.extend({
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: null,
      opened: false
    } as {
      data: any
      opened: boolean
    }
  },
  computed: {
    localData() {
      const vm = this as any
      return vm.columns.reduce((acc: any, i: any) => {
        let value

        if (typeof i.field !== 'function')
          value = get(vm.data, i.field, undefined)
        else value = i.field(vm.data)

        if (typeof value !== 'undefined') {
          acc.push({ name: i.label, value })
        }

        return acc
      }, [])
    }
  },
  watch: {
    opened(isOpen) {
      if (isOpen) {
        this.data = (this.$refs.modal as any).calledData
      } else {
        this.data = null
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'admin-modal';
</style>
