<template>
  <div class="select" :class="{ open: open, selected: selectedMode }">
    <!-- Cholistssed item -->
    <div class="select__selected a-ffr" @click="open = !open">
      {{ selected }}
      <IconArrowTop class="select__arrow-icon" />
    </div>
    <!--  -->

    <!-- Options list wrap -->
    <div class="select__items-wrap">
      <!-- Options list -->
      <ul class="select__items-list">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="select__item a-ffr"
          @click="handle(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <!--  -->
    </div>
    <span v-if="error && !selectedSomething" class="error">{{ error }}</span>
    <!--  -->
  </div>
</template>

<style lang="scss" scoped>
@import 'admin-select';
</style>

<script>
import IconArrowTop from '@/chunk/__svg/icon-arrow-top.svgm'

export default {
  components: {
    IconArrowTop
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    storeData: {
      type: Object
    },
    selectedMode: {
      type: Boolean
    },
    error: {
      type: String
    }
  },
  data() {
    return {
      default: 'No data for select',
      open: false,
      selected: null,
      selectedSomething: false
    }
  },
  created() {
    const vm = this
    if (vm.selectedMode) {
      vm.selected = vm.storeData?.name
      vm.$emit('select', vm.storeData?.id)
    } else {
      vm.selected = vm.list.length > 0 ? vm.list[0]?.name : vm.default
      vm.$emit('select', vm.list[0]?.id)
    }
  },
  methods: {
    handle(i) {
      const vm = this
      vm.selectedSomething = true
      vm.selected = i?.name
      vm.open = false
      vm.$emit('select', i?.id)
    }
  }
}
</script>
