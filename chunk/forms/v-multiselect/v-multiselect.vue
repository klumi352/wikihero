<template>
  <div class="multiselect search_page">
    <div v-click-outside="outsideHandle" class="multiselect__modal--wrap">
      <button
        :class="buttonClasses"
        class="multiselect__btn a-ffr"
        @click="open"
      >
        {{ processedSelectTitle }}
        {{ selectTitleLabel }}

        <icon-arrow class="arrow" />
        <icon-close
          v-if="selected.length"
          class="close arrow"
          @click="removeAll"
        />
      </button>

      <div :class="listClasses" class="multiselect__modal--modal small">
        <div class="multiselect__modal--modal-subwrap">
          <ul v-if="items.length">
            <li
              v-for="({ id, title, posts }, index) in separatedItems"
              :key="index"
              class="a-df a-aic"
            >
              <v-controll
                class="radio"
                :type="type"
                :value="title"
                :checked="isSelected(id)"
                @click="handleChange(id)"
              />
              <div class="a-df a-aic">
                <span class="title-small a-ffr">{{ title }}</span>
                <span class="multiselect__result-number a-ffr">{{
                  `(${posts})`
                }}</span>
              </div>
            </li>

            <span
              v-if="items.length > 5"
              class="collapse-label a-ffr"
              @click="handleCollapseClick"
              >{{ collapseLabel }}</span
            >
          </ul>

          <span v-else class="no-result a-ffr">{{ noResultLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-multiselect';
</style>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'radio'
    },
    selectTitle: String,
    items: Array,
    visibleCount: {
      type: Number,
      default: 5
    },
    selectedId: Number
  },
  data: () => ({
    isOpen: false,
    selected: [],
    isCollapsed: false
  }),
  computed: {
    isCollapseVisible() {
      return this.items.length >= this.visibleCount
    },
    collapseLabel() {
      if (this.isCollapsed) {
        return `collapse`
      }
      return `show ${this.remainingCollapsedCount} others`
    },
    remainingCollapsedCount() {
      return this.items.length - this.separatedItems.length
    },
    separatedItems() {
      if (!this.isCollapsed) {
        return this.items.slice(0, this.visibleCount)
      }
      return this.items
    },
    noResultLabel() {
      return 'No results from api'
    },
    selectTitleLabel() {
      const selectedCount = this.selected.length

      return selectedCount > 1 ? `+ ${selectedCount - 1}` : ''
    },
    buttonClasses() {
      return {
        active: this.isOpen,
        checked: this.selected.length
      }
    },
    listClasses() {
      return { open: this.isOpen }
    },
    processedSelectTitle() {
      if (this.selected.length) {
        return this.selected[0].title
      }
      return this.selectTitle
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.selected = this.selected.filter(({ id: selectedId }) => {
          return this.items.find(({ id }) => selectedId === id)
        })
      }
    },
    selectedId: {
      immediate: true,
      handler(val) {
        if (val) this.handleChange(val)
      }
    }
  },
  methods: {
    expandList() {},
    isSelected(necessaryId) {
      return this.selected.some(
        ({ id: selectedId }) => selectedId === necessaryId
      )
    },
    handleChange(id) {
      if (!this.isSelected(id)) {
        this.add(id)
      } else {
        this.remove(id)
      }
      this.$emit('change', this.selected)
    },
    add(id) {
      const item = this.items.find(({ id: necessaryId }) => id === necessaryId)
      this.selected.push(item)
    },
    remove(id) {
      const index = this.selected.findIndex(
        ({ id: necessaryId }) => id === necessaryId
      )
      this.selected.splice(index, 1)
    },
    removeAll() {
      this.selected = []
      this.$emit('change', this.selected)
    },
    open() {
      this.isOpen = !this.isOpen
    },
    outsideHandle() {
      this.isOpen = false
    },
    handleCollapseClick() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>
