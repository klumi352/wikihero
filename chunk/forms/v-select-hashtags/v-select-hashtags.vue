<template>
  <div class="select search_page">
    <div v-click-outside="hide" class="select__modal--wrap">
      <button :class="buttonClasses" class="select__btn a-ffr" @click="open">
        {{ processedSelectTitle }}
        {{ selectTitleLabel }}

        <icon-arrow class="arrow" />
        <icon-close
          v-show="selected.length"
          class="close arrow"
          @click="removeAll"
        />
      </button>

      <div :class="listClasses" class="select__modal--modal small">
        <div class="select__modal--input-wrap">
          <v-input
            placeholder-fade
            class="select__modal--search"
            placeholder="Chercher"
            type="text"
            :value="query"
            @input="handleSearch"
          />
          <icon-search
            class="select__modal--search-icon"
            width="16"
            height="16"
          />
        </div>

        <!-- Selection hashtags list -->
        <div>
          <div
            v-show="!toogleSearchList && showSelectionList"
            class="select__selection-wrap a-df a-fdc"
          >
            <h5 class="select__modal--most-use-title a-ffb">
              {{ 'Selection' }}
            </h5>
            <div>
              <ul class="select__selection-list">
                <li
                  v-for="({ name, posts_count, id }, index) in selected"
                  :key="index"
                  class="select__selection-item select__selection-button a-ffr"
                  @click="filterHandle(id)"
                >
                  {{ name }}
                  <span class="select__selection-count">{{ posts_count }}</span>
                  <span class="select__selection-close"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- --- -->

        <div class="select__modal--modal-subwrap">
          <!-- Default hashtags list -->
          <h5 class="select__modal--most-use-title a-ffb">{{ headerLabel }}</h5>

          <ul v-show="isListVisible" class="select__modal--use-list">
            <li
              v-for="({ id, name, posts_count }, index) in pagination.data"
              :key="index"
              class="select__modal--use-item"
              :class="itemClasses(id)"
              @click="handleClick(id)"
            >
              <span class="select__modal--use-hashtag a-ffr">{{ name }}</span>
              <span class="select__modal--use-amount a-ffr">{{
                posts_count
              }}</span>
            </li>
          </ul>
          <!-- --- -->

          <!-- Error no result -->
          <span v-show="!isListVisible" class="no-result a-ffr">{{
            noResultLabel
          }}</span>
          <!-- --- -->
        </div>

        <!-- Validate button -->
        <div>
          <button
            v-if="showSelectionList"
            class="select__validation-button a-ffb"
            @click="() => validateSelectionRequest()"
          >
            {{ 'Valider selection' }}
          </button>
        </div>
        <!-- --- -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-select-hashtags';
</style>

<script lang="ts">
import ClickOutside from 'vue-click-outside'
export default {
  directives: {
    ClickOutside
  },
  props: {
    selectTitle: String,
    pagination: Object,
    selectedHashtag: Number
  },
  data: () => ({
    isOpen: false,
    selected: [],
    query: null,
    currentPage: 1,
    validate: false
  }),
  computed: {
    isListVisible() {
      return Object.keys(this.pagination).length && this.pagination.data.length
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
        return this.selected[0].name
      }

      return this.selectTitle
    },
    showMoreLabel() {
      return 'Show more'
    },
    headerLabel() {
      return this.query ? 'Search results' : 'Most used Hashtags'
    },
    toogleSearchList() {
      return !!this.query
    },
    showSelectionList() {
      return this.selected.length
    },
    noResultLabel() {
      return 'No results from api'
    },
    selectTitleLabel() {
      const selectedCount = this.selected.length

      return selectedCount > 1 ? `+ ${selectedCount}` : ''
    }
  },
  watch: {
    selectedHashtag: {
      immediate: true,
      handler(val) {
        if (val) this.handleClick(val)
      }
    },
    selected: {
      immediate: true,
      handler(val) {
        if (val.length < 1 && !this.validate) {
          this.$emit('change', val)
        }
      }
    }
  },
  mounted() {
    const vm = this
    vm.popupItem = this.$el
  },
  methods: {
    itemClasses(id) {
      return {
        selected: this.isSelected(id)
      }
    },
    isSelected(necessaryId) {
      return this.selected.some(
        ({ id: selectedId }) => selectedId === necessaryId
      )
    },
    add(id) {
      const item = this.pagination.data.find(
        ({ id: necessaryId }) => id === necessaryId
      )
      if (this.query) {
        this.selected.push(item)
        this.$emit('search', '')
        this.query = null
        return
      }
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
    hide() {
      this.isOpen = false
    },
    handleSearch({ target: { value } }) {
      this.query = value
      this.$emit('search', this.query)
    },
    handleOutsideClick() {
      this.isOpen = false
    },
    handleClick(id) {
      if (!this.isSelected(id)) {
        this.add(id)
      } else {
        this.remove(id)
      }
    },
    filterHandle(id) {
      if (this.isSelected(id)) {
        this.remove(id)
      }
    },
    validateSelectionRequest() {
      this.$emit('change', this.selected)
      this.isOpen = false
      this.query = null
    }
  }
}
</script>
