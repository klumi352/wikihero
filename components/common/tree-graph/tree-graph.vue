<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Choose reorder element</h3>
        <tree-item
          ref="t1"
          mode="from"
          :reorder-id="reorderId"
          :relation="() => $refs.t2"
          @reorder="reorderFrom"
        />
      </div>
      <div class="col">
        <h3>Choose element to paste</h3>
        <tree-item
          ref="t2"
          mode="to"
          :reorder-id="reorderId"
          :relation="() => $refs.t1"
          @reorder="reorderTo"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeItem from './tree-item/tree-item.vue'
export default Vue.extend({
  components: {
    TreeItem
  },
  data() {
    return {
      reorderId: null
    }
  },
  mounted() {
    // alert('Please, dont use this module now!')
  },
  methods: {
    reorderFrom({ id }: any) {
      const vm = this as any
      vm.reorderId = id
    },
    reorderTo({ id }: any) {
      const vm = this as any
      this.$store
        .dispatch('topic/reorder', {
          data: { id: vm.reorderId, parentId: id }
        })
        .then(() => {
          vm.$refs.t1.refresh()
          vm.$refs.t2.refresh()
        })
        .catch(() => {})
        .finally(() => (vm.reorderId = null))
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'tree-graph';
</style>
