<template>
  <div class="select">
    <div>
      <ul class="select__selected-list">
        <li
          v-for="(item, index) in value"
          :key="index"
          class="select__selected-item a-ffr"
        >
          {{ item.title }}
          <span class="close" @click="deleteItem(item)"></span>
        </li>
      </ul>
    </div>

    <div :class="{ open: open }" class="select__main-wrap">
      <div class="select__selected a-ffr" @click="open = !open">
        <span class="select__selected-title">{{ 'Choose group' }}</span>
        <IconArrowTop class="select__arrow-icon" />
      </div>

      <div class="select__items-wrap">
        <ul class="select__items-list">
          <li
            v-for="(item, index) in list"
            :key="index"
            class="select__item a-ffr"
            @click="
              addItem(item)
              open = false
            "
          >
            {{ item[label] }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'admin-multiselect';
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
    transformer: {
      type: Function,
      default: () => (array) => array
    },
    id: Number,
    value: Array,
    name: String,
    label: String,
    selectedMode: Boolean
  },
  data() {
    return {
      open: false
    }
  },
  watch: {},
  created() {},
  methods: {
    addItem($value) {
      if (this.value) {
        const itemExist = this.value.some(({ id }) => $value.id === id)
        if (!itemExist) {
          this.$emit('select', {
            target: {
              name: this.name,
              value: [...new Set([...this.value, $value])]
            }
          })
        }
      }
    },
    deleteItem($value) {
      this.$emit('select', {
        target: {
          name: this.name,
          value: [...this.value].filter(({ id }) => id !== $value.id)
        }
      })
    }
  }
}
</script>
