<template>
  <div
    ref="categoryDropdown"
    v-click-outside="hide"
    :class="setCategoryClasses"
    class="search-bar__category-dropdown"
  >
    <fetch-loading :class="{ loading: categoryLoading }">
      <button
        class="search-bar__category-btn a-ffr"
        :class="setClasses"
        :disabled="categoryLoading"
        @click.prevent.self="open"
      >
        {{ setTitle }}
        <span>{{ setCount }}</span>
        <icon-arrow class="search-bar__category-btn-arrow" />
        <icon-close
          class="search-bar__category-btn-cross"
          @click="clearSelectedParam"
        />
      </button>
    </fetch-loading>
    <div class="search-bar__category-modal">
      <div class="search-bar__category-wrap">
        <ul class="search-bar__category-dropdown-list">
          <li
            v-for="(item, index) in categoryList"
            :key="index"
            class="search-bar__category-dropdown-item a-ffr"
          >
            <label :for="`category_id_${item.id}`">
              {{ `${item.title} (${item.posts})` }}
              <v-controll
                :id="`category_id_${item.id}`"
                class="radio"
                type="checkbox"
                name="category_id"
                :value="item.id"
                :checked="isSelected(item.id)"
                @input="
                  () => {
                    $store.commit('search/ADD_FILTER_CATEGORY_ID', item)
                    fetchHashtag()
                  }
                "
              />
            </label>
          </li>
        </ul>
      </div>
      <div
        v-if="selectedCategoryId.length || selectedCategoryId_prepared.length"
      >
        <button
          class="search-bar__category-validate-button a-ffb"
          @click="fetchData"
        >
          {{ $t('global.valider-selection-button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './category-dropdown.scss';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import ClickOutside from 'vue-click-outside'
import { mapGetters, mapState } from 'vuex'
export default {
  inject: ['mark'],
  directives: {
    ClickOutside
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters('search', [
      'categoryList',
      'selectedCategIdCollection',
      'setGroupId'
    ]),
    ...mapState('search', [
      'selectedCategoryId',
      'searchQuery',
      'categoryLoading',
      'selectedCategoryId_prepared'
    ]),
    setTitle() {
      return this.selectedCategoryId[0]?.title || this.$t('search.categories')
    },
    setCategoryClasses() {
      return {
        openCategoryDropdown: this.isOpen
      }
    },
    setClasses() {
      return {
        selectedTitle: this.selectedCategoryId[0]?.title,
        setCount: this.selectedCategoryId.length > 1,
        selectedCategoryId: this.selectedCategoryId.length
      }
    },
    setCount() {
      return this.selectedCategoryId.length > 1
        ? `+${this.selectedCategoryId.length}`
        : ''
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs.categoryDropdown
  },
  methods: {
    open() {
      this.isOpen = !this.isOpen
    },
    hide() {
      this.isOpen = false
    },
    isSelected(id) {
      return this.selectedCategoryId.some((el) => el.id === id)
    },
    async fetchHashtag(clearAll = false) {
      try {
        if (clearAll) this.$store.commit('search/SET_INITIAL_CATEGORY_ID')
        this.$store.commit('search/TOOGLE_HASHTAG_LOADING', true)
        await this.$store.dispatch('search/FETCH_HASHTAG', {
          group_id: this.setGroupId,
          // query: this.searchQuery,
          categoryId: this.selectedCategIdCollection
        })
      } catch (e) {
        throw e
      } finally {
        setTimeout(() => {
          this.$store.commit('search/TOOGLE_HASHTAG_LOADING', false)
        }, 300)
      }
    },
    async fetchData() {
      this.hide()
      this.$root.globalModals.searchPreloader.showPreloader()
      this.$store.commit(
        'search/SET_CATEGORY_ID_BY_VALIDATE',
        this.selectedCategIdCollection
      )
      try {
        await Promise.all([
          this.$store.dispatch('search/FETCH_POST'),
          this.$store.dispatch('search/FETCH_COMMENT'),
          this.$store.dispatch('search/FETCH_GROUP_DATA'),
          this.$store.dispatch('search/FETCH_HASHTAG_DATA')
        ])
        this.mark()
      } catch (e) {
        throw e
      } finally {
        setTimeout(() => {
          this.$root.globalModals.searchPreloader.hidePreloader()
        }, 300)
      }
    },
    async clearSelectedParam() {
      await Promise.all([this.fetchHashtag(true), this.fetchData()])
    }
  }
}
</script>
