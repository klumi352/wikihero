<template>
  <div
    :ref="`${name}-dropdown`"
    v-click-outside="hide"
    :class="setSelectClasses"
    class="select"
  >
    <!--  Dropdown button-->
    <button class="select__btn a-ffr" @click="toogle">
      {{ setTitle }}
      <icon-arrow class="select__btn-arrow" />
    </button>
    <!-- --- -->

    <!-- Validation error -->
    <div v-if="error" class="select__error-message">
      <span class="error">{{ error }}</span>
    </div>
    <!-- --- -->

    <!-- Modal window -->
    <div class="select__modal">
      <!-- --- -->
      <div class="select__modal-wrap">
        <!-- --- -->
        <ul class="select__dropdown-list">
          <li
            v-for="(item, index) in data"
            :key="index"
            class="select__dropdown-item"
          >
            <label :for="`${name}_${item.id}`">
              <div class="select__dropdown-content-wrap">
                <p class="select__dropdown-content-title a-ffr">
                  {{ item.title }}
                </p>
                <p class="select__dropdown-content-description a-ffr">
                  {{ item.description }}
                </p>
              </div>
              <v-controll
                :id="`${name}_${item.id}`"
                class="radio"
                type="radio"
                :name="name"
                :checked="formValue === item.id"
                @input="select(item)"
              />
            </label>
          </li>
        </ul>
        <!-- --- -->
      </div>
      <!-- --- -->
    </div>
    <!-- --- -->
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  directives: {
    ClickOutside
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: 'DefaultType'
    },
    title: {
      type: String
    },
    formValue: {
      type: Number
    },
    error: {
      type: [String, Object]
    }
  },
  data() {
    return {
      isOpen: false,
      isChecked: false,
      localTitle: ''
    }
  },
  computed: {
    getComputedTitle() {
      return this.data.filter((i) => i.id === this.formValue)[0]?.title
    },
    setSelectClasses() {
      return {
        opened: this.isOpen,
        checked: this.isChecked
      }
    },
    setTitle() {
      return this.localTitle || this.title
    }
  },
  watch: {
    data() {
      this.localTitle = this.title
      this.isChecked = false
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs[`${this.name}-dropdown`]
    if (this.getComputedTitle) {
      this.localTitle = this.getComputedTitle
      this.isChecked = true
    }
  },
  methods: {
    toogle() {
      this.isOpen = !this.isOpen
    },
    hide() {
      this.isOpen = false
    },
    select(v) {
      this.$emit('select', v)
      this.localTitle = v.title
      this.hide()
      this.isChecked = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'category-select';
</style>
