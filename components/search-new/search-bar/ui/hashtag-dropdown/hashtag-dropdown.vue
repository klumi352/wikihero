<template>
  <div
    ref="hashtagDropdown"
    v-click-outside="hide"
    class="search-bar__hashtag-dropdown"
    :class="setHashtagClasses"
  >
    <fetch-loading :class="{ loading: hashtagLoading }">
      <button
        class="search-bar__hashtag-btn a-ffr"
        :disabled="hashtagLoading"
        :class="setClasses"
        @click.prevent.self="open"
      >
        {{ setTitle }}
        <span>{{ setCount }}</span>
        <icon-arrow class="search-bar__hashtag-btn-arrow" />
        <icon-close
          class="search-bar__hashtag-btn-cross"
          @click="fetchData(true)"
        />
      </button>
    </fetch-loading>
    <div class="search-bar__hashtag-modal">
      <div>
        <!-- Search input -->
        <div class="search-bar__input-wrap">
          <v-input
            placeholder-fade
            class="search-bar__search"
            placeholder="Chercher"
            type="text"
            name="hashtag-search"
            :value="hashtagQuery"
            @input="
              ($event) => {
                debounceSearch($event)
                hashtagQuery = $event.target.value
              }
            "
          />
          <icon-search class="search-bar__search-icon" width="16" height="16" />
        </div>
        <!--  -->
        <div
          v-if="selectedHashtagId.length && !queryExist"
          class="search-bar__hashtag-selected-section"
        >
          <h5 class="search-bar__hashtag-selected-title a-ffb">
            Selection
          </h5>
          <ul class="search-bar__hashtag-selected-list">
            <li
              v-for="(item, index) in selectedHashtagId || []"
              :key="index"
              class="search-bar__hashtag-selected-item a-ffr"
              @click="
                () => {
                  $store.commit('search/ADD_FILTER_HASHTAG_ID', item)
                }
              "
            >
              <span>{{ computeName(item) }}</span>
              <span class="search-bar__hashtag-selected-count">{{
                computeCount(item)
              }}</span>
              <span class="search-bar__hashtag-selected-close"></span>
            </li>
          </ul>
        </div>
        <div class="search-bar__hashtag-section">
          <h5 class="search-bar__hashtag-title a-ffb">{{ headerLabel }}</h5>
          <ul v-if="hashtagList.length" class="search-bar__hashtag-list">
            <li
              v-for="(item, index) in hashtagList || []"
              :key="index"
              :class="[{ selected: hashtagSelected({ id: computeId(item) }) }]"
              class="search-bar__hashtag-item a-ffr"
              @click="
                () => {
                  if (queryExist) {
                    hashtagQuery = null
                    $store.dispatch('search/FETCH_HASHTAG', {
                      group_id: setGroupId,
                      query: hashtagQuery
                    })
                  }
                  $store.commit('search/ADD_FILTER_HASHTAG_ID', item)
                }
              "
            >
              <span class="search-bar__hashtag-name">{{
                computeName(item)
              }}</span>
              <span class="search-bar__hashtag-count">{{
                computeCount(item)
              }}</span>
            </li>
          </ul>
          <span v-else>No data from api</span>
        </div>
        <div
          v-if="selectedHashtagId.length || selectedHashtagId_prepared.length"
        >
          <button
            class="search-bar__hashtag-validate-button a-ffb"
            @click="fetchData(false)"
          >
            {{ $t('global.valider-selection-button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './hashtag-dropdown.scss';
</style>

<script>
/* eslint-disable require-await */
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable vue/return-in-computed-property */
import ClickOutside from 'vue-click-outside'
import { mapGetters, mapState } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  inject: ['mark'],
  directives: {
    ClickOutside
  },
  data() {
    return {
      hashtagIsOpen: false,
      hashtagQuery: null
    }
  },
  computed: {
    ...mapState('search', [
      'searchQuery',
      'groupId',
      'selectedHashtagId',
      'selectedHashtagId_prepared',
      'hashtagLoading'
    ]),
    ...mapGetters('search', [
      'hashtagList',
      'hashtagSelected',
      'setGroupId',
      'selectedHashtagIdCollection'
    ]),
    setHashtagClasses() {
      return {
        openHashtagDropdown: this.hashtagIsOpen
      }
    },
    headerLabel() {
      if (this.selectedHashtagId.length && !this.hashtagQuery) {
        return this.$t('search.tags-selected-subtitle')
      } else if (this.hashtagQuery) {
        return this.$t('search.search-result')
      } else {
        return this.$t('search.most-use-hashtags')
      }
    },
    queryExist() {
      return !!this.hashtagQuery
    },
    setTitle() {
      return this.selectedHashtagId[0]?.name || this.$t('search.hashtags')
    },
    setCount() {
      return this.selectedHashtagId.length > 1
        ? `+${this.selectedHashtagId.length}`
        : ''
    },
    setClasses() {
      return {
        selectedTitle: this.selectedHashtagId[0]?.name,
        setCount: this.selectedHashtagId.length > 1,
        selectedHashtagId: this.selectedHashtagId.length
      }
    }
  },
  watch: {
    selectedHashtagIdCollection: {
      deep: true,
      handler() {
        this.$store.dispatch('search/FETCH_HASHTAG', {
          group_id: this.setGroupId,
          // query: event.target.value || this.searchQuery
          query: this.hashtagQuery
        })
      }
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs.hashtagDropdown
  },
  methods: {
    debounceSearch: debounce(async function(event) {
      this.$store.dispatch('search/FETCH_HASHTAG', {
        group_id: this.setGroupId,
        // query: event.target.value || this.searchQuery
        query: event.target.value
      })
    }, 300),
    computeName(v) {
      return v?.name
    },
    computeId(v) {
      return v?.id
    },
    computeCount(v) {
      return v?.posts_count
    },
    open() {
      this.hashtagIsOpen = !this.hashtagIsOpen
    },
    hide() {
      this.hashtagIsOpen = false
    },
    async fetchData(clearSelected) {
      if (clearSelected) this.$store.commit('search/SET_INITIAL_HASHTAG_ID')
      this.hide()
      this.$root.globalModals.searchPreloader.showPreloader()
      this.$store.commit(
        'search/SET_HASHTAG_ID_BY_VALIDATE',
        this.selectedHashtagIdCollection
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
    }
  }
}
</script>
