<template>
  <div
    ref="typeResultDropdown"
    v-click-outside="hide"
    :class="setTypeResultClasses"
    class="search-bar__type-result-dropdown"
  >
    <button
      class="search-bar__type-result-btn a-ffr"
      :class="setClasses"
      @click.prevent.self="open"
    >
      {{ setTitle }}
      <span>{{ setCount }}</span>
      <icon-arrow class="search-bar__type-result-btn-arrow" />
      <icon-close
        class="search-bar__type-result-btn-cross"
        @click="deleteSelected"
      />
    </button>

    <div class="search-bar__type-result-modal">
      <div>
        <ul class="search-bar__type-result-dropdown-list">
          <li
            v-for="(item, index) in typeList"
            :key="index"
            class="search-bar__type-result-dropdown-item a-ffr"
          >
            <label :for="item.id">
              {{ `${item.label} (${item.count})` }}
              <v-controll
                :id="item.id"
                class="radio"
                type="checkbox"
                name="type_value"
                :value="item.id"
                :checked="isSelected(item.label)"
                @input="
                  () => {
                    addFilterType(item)
                  }
                "
              />
            </label>
          </li>
        </ul>
      </div>
      <div v-if="selectedType.length || selectedTypeValue.length">
        <button
          class="search-bar__type-result-validate-button a-ffb"
          @click="validate"
        >
          {{ $t('global.valider-selection-button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './type-result-dropdown.scss';
</style>

<script>
import ClickOutside from 'vue-click-outside'
import { mapGetters, mapState } from 'vuex'
export default {
  directives: {
    ClickOutside
  },
  data() {
    return {
      isOpen: false,
      selectedType: []
    }
  },
  computed: {
    setTypeResultClasses() {
      return {
        openTypeResultDropdown: this.isOpen
      }
    },
    setTitle() {
      return this.selectedType[0]?.label || this.$t('search.type-of-results')
    },
    setCount() {
      return this.selectedType.length > 1 ? `+${this.selectedType.length}` : ''
    },
    setClasses() {
      return {
        selectedTitle: this.selectedType[0]?.label,
        setCount: this.selectedType.length > 1,
        showDeleteButton: this.selectedType.length
      }
    },
    ...mapGetters('search', [
      'takePostCount',
      'takeCommentCount',
      'takeGroupCount',
      'takeHashtagCount'
    ]),
    ...mapState('search', ['selectedTypeValue']),
    typeList() {
      return [
        {
          label: this.$t('search.posts'),
          count: this.takePostCount || 0,
          id: 'post_type_selector'
        },
        {
          label: this.$t('search.comments'),
          count: this.takeCommentCount || 0,
          id: 'comment_type_selector'
        },
        {
          label: this.$t('search.groups'),
          count: this.takeGroupCount || 0,
          id: 'groupData_type_selector'
        },
        {
          label: this.$t('search.hashtags'),
          count: this.takeHashtagCount || 0,
          id: 'hashtagData_type_selector'
        }
      ]
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs.typeResultDropdown
  },
  methods: {
    open() {
      this.isOpen = !this.isOpen
    },
    validate() {
      this.$root.globalModals.searchPreloader.showPreloader()
      if (!this.selectedType.length) {
        this.deleteSelected()
        setTimeout(() => {
          this.$root.globalModals.searchPreloader.hidePreloader()
        }, 700)
        return
      }
      this.$store.commit('search/TOOGLE_MOD_TYPE', true)
      this.$store.commit('search/SET_TYPE_COLLECTION', [...this.selectedType])
      this.isOpen = false
      setTimeout(() => {
        this.$root.globalModals.searchPreloader.hidePreloader()
      }, 300)
    },
    hide() {
      this.isOpen = false
    },
    isSelected(label) {
      return this.selectedType.some((el) => el.label === label)
    },
    addFilterType(value) {
      const exist = this.selectedType.some(({ id }) => id === value.id)
      if (!exist) this.selectedType.push(value)
      else
        this.selectedType = this.selectedType.filter(
          ({ id }) => id !== value.id
        )
    },
    deleteSelected() {
      this.$root.globalModals.searchPreloader.showPreloader()
      this.isOpen = false
      this.selectedType = []
      this.$store.commit('search/TOOGLE_MOD_TYPE', false)
      this.$store.commit('search/SET_INITIAL_TYPE_COLLECTION')
      setTimeout(() => {
        this.$root.globalModals.searchPreloader.hidePreloader()
      }, 300)
    }
  }
}
</script>
