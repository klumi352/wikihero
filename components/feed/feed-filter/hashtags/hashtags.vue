<template>
  <div class="filter__tags a-df a-fdc">
    <div class="filter__subtitle">
      <div class="filter__subtitle-wrap a-df a-jcsb a-aic">
        <h4 class="a-ffr">{{ $t('filter.tags-title') }}</h4>
        <div
          v-click-outside="handleClickOutside"
          class="header-search"
          :class="searchWrapperClasses"
          @click="handleOpenSearchDropdown"
        >
          <input
            :value="query"
            type="text"
            :placeholder="inputPlaceholder"
            @input="handleSearch($event)"
          />

          <icon-search />

          <div class="header-search-dropdown" :class="searchDropdownClasses">
            <ul v-if="!searchHashtags.length" class="dropdown-list">
              <li class="dropdown-list-item-noResult a-ffr">
                {{ $t('feed.no_result') }}
              </li>
            </ul>
            <ul v-else class="dropdown-list">
              <li
                v-for="(item, key) in searchHashtags"
                :key="key"
                :class="{
                  selected: !!checkExist({
                    value: item.id,
                    obj: 'selected_hashtags'
                  })
                }"
                class="dropdown-list-item a-df a-fdc"
                @click="handleSelectHashtag(item, 'selected_hashtags')"
              >
                <span class="dropdown-list-name a-ffr">{{ item.name }}</span>
                <span class="dropdown-list-description a-ffr">{{
                  item.description
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="checkSelection" class="filter__select-wrap a-df a-fdc">
      <h4 class="a-ffb">{{ $t('filter.selection') }}</h4>

      <ul v-if="selectedHashtags.length">
        <li
          v-for="(item, index) in selectedHashtags"
          :key="index"
          class="a-df a-fdc"
        >
          <button
            class="a-ffr"
            @click="handleRemoveHashtag(item, 'selected_hashtags')"
          >
            {{ item.name }}
            <span>{{ item.posts_count }}</span>
            <span class="close"></span>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="hashtagsList" class="filter__tags-wrap a-df a-fdc">
      <h4 class="a-ffb">{{ computedTitle }}</h4>
      <ul>
        <li
          v-for="(item, index) in hashtagsList.data"
          :key="index"
          class="a-df a-fdc"
        >
          <button
            class="filter__tag a-ffr"
            :class="{
              selected: !!checkExist({
                value: item.id,
                obj: 'selected_hashtags'
              })
            }"
            @click="handleSelectHashtag(item, 'selected_hashtags')"
          >
            {{ item.name }}
            <span>{{ item.posts_count }}</span>
          </button>
        </li>
      </ul>

      <v-pagination
        class="buttons"
        :meta="hashtagsList.meta"
        :loading="false"
        @change="handleHashtagPaginate"
      />
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable no-useless-catch */
import debounce from 'lodash/debounce'
import { mapState, mapGetters } from 'vuex'
export default {
  model: {
    prop: 'selected',
    event: 'update-selected'
  },
  data() {
    return {
      query: null,
      searchHashtags: [],
      isFocus: false,
      data: []
    }
  },
  computed: {
    ...mapState({
      isSelectedCount: (state) => state.filter.isSelected,
      selectedCategories: (state) => state.filter.selected_categories,
      selectedHashtags: (state) => state.filter.selected_hashtags,
      hashtagsList: (state) => state.filter.hashtags
    }),
    computedTitle() {
      return this.selectedHashtags.length
        ? this.$t('filter.tags-selected-subtitle')
        : this.$t('filter.tags-subtitle')
    },
    ...mapGetters('filter', [
      'checkExist',
      'checkMeta',
      'categoriesQuery',
      'getCategsId'
    ]),
    inputPlaceholder() {
      return this.isFocus ? 'Search tags' : this.$t('header.search')
    },
    searchWrapperClasses() {
      return {
        focused: this.isFocus
      }
    },
    searchDropdownClasses() {
      return {
        open: this.isFocus
      }
    },
    checkSelection() {
      return this.selectedHashtags.length
    }
  },
  async created() {
    const vm = this
    try {
      const params = {
        q: null
      }
      const pagination = await vm.$axios.get('/hashtags/filter', {
        params
      })
      vm.searchHashtags = pagination.data
    } catch (e) {
      throw e
    } finally {
    }
  },
  methods: {
    searchItemClasses() {
      const selected = false

      return {
        selected
      }
    },
    hashtagClasses() {
      const active = false

      return {
        active
      }
    },
    handleHashtagPaginate({ page }) {
      this.$emit('paginate', this.query, page)
    },
    handleRemoveHashtag(v: object, obj: string) {
      const vm = this
      vm.$store.commit('filter/DELETE_SELECTED_DATA', {
        value: v,
        obj
      })
      this.$emit('update-selected')
    },
    handleSelectHashtag(v: object, obj: string) {
      const vm = this
      !vm.checkExist({ value: v.id, obj })
        ? vm.$store.commit('filter/PUSH_SELECTED_DATA', { obj, value: v })
        : null
      this.$emit('update-selected')
    },
    handleOpenSearchDropdown() {
      this.isFocus = true
    },
    handleClickOutside() {
      this.isFocus = false
    },
    handleSearch: debounce(async function({ target: { value } }) {
      const vm = this
      vm.query = value
      try {
        const params = {
          q: value
        }
        const pagination = await vm.$axios.get('/hashtags/filter', {
          params
        })
        vm.searchHashtags = pagination.data
      } catch (e) {
        throw e
      } finally {
      }
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
@import 'hashtags';
@import '../feed-filter.scss';
</style>
