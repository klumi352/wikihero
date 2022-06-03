<template>
  <div
    class="search-input__search-input-wrap"
    :class="[
      {
        searching: checkSearch,
        validation: isValidate,
        focused: queryExist,
        hidePlaceholder: hidePlaceholder,
        searchFieldExist: searchQuery
      }
    ]"
  >
    <div class="search-input__search-input-box">
      <input
        id="searchField"
        ref="searchField"
        type="text"
        class="search-input__search-input a-ffr"
        name="search"
        autocomplete="off"
        :value="searchQuery"
        @input="
          ($event) => {
            $store.commit('search/SET_SEARCH_QUERY', $event.target.value)
            debounceSearch($event)
          }
        "
      />
      <span class="search-input__search-input-placeholder a-ffr">{{
        $t('header.placeholder-1')
      }}</span>
    </div>
    <div class="search-input__search-input-preloader"></div>
    <button
      v-if="searchQuery"
      class="search-input__search-clear"
      @click="clearSearchQuery"
    >
      <icon-close />
    </button>
    <div class="search-input__error-message a-ffr">
      {{ $t('errors.header-search-error') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './search-input.scss';
</style>

<script>
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable vue/return-in-computed-property */
/* eslint-disable vue/no-unused-components */
/* eslint-disable no-useless-catch */
import { mapGetters, mapState } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  inject: ['mark'],
  data() {
    return {
      isSearching: false
    }
  },
  computed: {
    ...mapState('search', ['searchQuery', 'groupId', 'setGroupId']),
    ...mapGetters('search', ['groupList', 'takeCurGroup']),
    checkSearch() {
      return !!this.isSearching
    },
    isValidate() {
      return this.searchQuery?.length > 0 && this.searchQuery?.length < 3
    },
    queryExist() {
      return this.searchQuery?.length
    },
    hidePlaceholder() {
      return this.searchQuery?.length > 0
    }
  },
  methods: {
    debounceSearch: debounce(function(event) {
      if (event.target.value.length > 0 && event.target.value.length < 3) return
      this.$refs.searchField.blur()
      this.isSearching = true
      setTimeout(async () => {
        this.$root.globalModals.searchPreloader.showPreloader()
        try {
          await Promise.all([
            this.$store.dispatch('search/FETCH_POST', {
              group_id: this.setGroupId,
              q: event.target.value
            }),
            this.$store.dispatch('search/FETCH_COMMENT', {
              group_id: this.setGroupId,
              q: event.target.value
            }),
            this.$store.dispatch('search/FETCH_GROUP_DATA', {
              group_id: this.setGroupId,
              q: event.target.value
            }),
            this.$store.dispatch('search/FETCH_HASHTAG_DATA', {
              group_id: this.setGroupId,
              q: event.target.value
            })
          ])
          this.mark()
        } catch (e) {
          throw e
        } finally {
          setTimeout(() => {
            this.$refs.searchField.focus()
            this.$root.globalModals.searchPreloader.hidePreloader()
            this.isSearching = false
          }, 300)
        }
      }, 300)
    }, 700),
    async clearSearchQuery() {
      this.$refs.searchField.blur()
      this.isSearching = true
      this.$store.commit('search/SET_SEARCH_QUERY', null)
      try {
        this.$root.globalModals.searchPreloader.showPreloader()
        await Promise.all([
          this.$store.dispatch('search/FETCH_POST', {
            group_id: this.setGroupId,
            q: null
          }),
          this.$store.dispatch('search/FETCH_COMMENT', {
            group_id: this.setGroupId,
            q: null
          }),
          this.$store.dispatch('search/FETCH_GROUP_DATA', {
            group_id: this.setGroupId,
            q: null
          }),
          this.$store.dispatch('search/FETCH_HASHTAG_DATA', {
            group_id: this.setGroupId,
            q: null
          })
        ])
        this.mark()
      } catch (e) {
        throw e
      } finally {
        setTimeout(() => {
          this.isSearching = false
          this.$root.globalModals.searchPreloader.hidePreloader()
        }, 700)
      }
    }
  }
}
</script>
