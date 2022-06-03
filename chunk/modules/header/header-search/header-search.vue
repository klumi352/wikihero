<template>
  <div
    v-click-outside="hide"
    class="header-search"
    :class="{ focused: isFocus, dropdown: data.length || isPage }"
    @click="open"
  >
    <form autocomplete="off" class="header-search__form" @submit.prevent>
      <input
        ref="search"
        v-model="search"
        type="text"
        autocomplete="nope"
        autocorrect="off"
        autocapitalize="none"
        :placeholder="
          isFocus ? $t('header.placeholder-1') : $t('header.search')
        "
        @keyup.enter="setSearch"
      />
      <span
        class="header-search__error-tooltip a-ffr"
        :class="[{ showErrorTooltip }]"
        >{{ error }}</span
      >
    </form>
    <icon-search @click="setSearch" />
    <div
      class="header-search-dropdown"
      :class="{ open: (isFocus && data.length) || (isFocus && isPage) }"
    >
      <div v-if="isPage" class="dropdown-group">
        <v-controll type="checkbox" @input="getGroup">
          <span class="dropdown-group-txt a-ffr">
            {{ $t('header.search-in-group') }}
          </span>
        </v-controll>
      </div>
      <h4 v-if="data.length" class="dropdown-title">
        {{ $t('header.recent') }}
      </h4>
      <ul v-if="data.length" class="dropdown-list">
        <li v-for="(item, key) in data" :key="key" class="dropdown-list-item">
          <nuxt-link
            :to="`/search${item.query}`"
            class="dropdown-list-link a-ffr"
          >
            {{ item.value }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  data() {
    return {
      isFocus: false,
      search: '',
      data: [],
      groupChecked: false,
      error: '',
      showErrorTooltip: false
    }
  },
  watch: {
    search(val) {
      if (val.length < 3 && val.length > 0) {
        this.error = this.$t('errors.header-search-error')
        this.showErrorTooltip = true
        return
      }
      this.showErrorTooltip = false
      this.error = ''
    }
  },
  computed: {
    ...mapState('group', ['group_page']),
    isPage() {
      return this.$route.name === 'topic-group'
    }
  },
  mounted() {
    this.getSearchStorage()
  },
  methods: {
    getGroup(e) {
      this.groupChecked = e.target.checked
    },
    open(): void {
      !this.isFocus && this.getSearchStorage()
      this.isFocus = true
      document.documentElement.classList.add('g-search')
    },
    hide(): void {
      this.isFocus = !!this.search || false
      document.documentElement.classList.remove('g-search')
    },
    getSearchStorage(): void {
      const search_items = localStorage.getItem('recent_search')
      this.data = search_items ? JSON.parse(search_items) : []
    },
    setSearchStorage(): void {
      const search_items = localStorage.getItem('recent_search')
      const temp_data = search_items ? JSON.parse(search_items) : []
      if (temp_data.length === 3) temp_data.pop()
      if (this.groupChecked) {
        temp_data.unshift({
          value: this.search,
          query: `?search=${this.search}&group_id=${this.group_page.id}`
        })
        localStorage.setItem('recent_search', JSON.stringify(temp_data))
        return
      }
      temp_data.unshift({
        value: this.search,
        query: `?search=${this.search}`
      })
      localStorage.setItem('recent_search', JSON.stringify(temp_data))
    },
    setSearch(): void {
      const searchObj = {}
      if (this.search && this.search.length > 2) {
        searchObj.search = this.search
        if (this.groupChecked) searchObj.group_id = this.group_page.id
        this.setSearchStorage()
        this.$router.push({ path: '/search', query: searchObj })
        this.search = ''
        this.$refs.search.blur()
        this.hide()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'header-search.scss';
</style>
