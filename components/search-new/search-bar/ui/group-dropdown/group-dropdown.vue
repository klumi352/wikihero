<template>
  <div
    ref="groupDropdown"
    v-click-outside="hide"
    class="search-bar__group-dropdown"
    :class="setGroupClasses"
  >
    <button class="search-bar__group-btn a-ffr" @click="open">
      {{ takeGroupTitle }}
      <icon-arrow class="search-bar__group-btn-arrow" />
    </button>
    <div class="search-bar__group-dropdown-modal">
      <ul class="search-bar__group-dropdown-list">
        <li
          v-for="({ id, title, isChecked }, index) in groupList || []"
          :key="index"
          class="search-bar__group-dropdown-item a-ffr"
        >
          <label :for="`group_id_${id}`"
            >{{ title }}
            <v-controll
              :id="`group_id_${id}`"
              class="radio"
              type="radio"
              name="group_id"
              :checked="
                groupId === id ? (isChecked = true) : (isChecked = false)
              "
              @input="fetchData(id)"
            />
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './group-dropdown.scss';
</style>

<script>
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable vue/return-in-computed-property */
/* eslint-disable no-useless-catch */
import { mapGetters, mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
export default {
  inject: ['mark'],
  directives: {
    ClickOutside
  },
  data() {
    return {
      groupIsOpen: false
    }
  },
  computed: {
    setGroupClasses() {
      return {
        openGroupDropdown: this.groupIsOpen
      }
    },
    ...mapState('search', ['searchQuery', 'groupId']),
    ...mapGetters('search', ['groupList', 'takeCurGroup', 'setGroupId']),
    takeGroupTitle() {
      return this.takeCurGroup({ groupId: this.groupId || 0 })?.title
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs.groupDropdown
  },
  methods: {
    open() {
      this.groupIsOpen = !this.groupIsOpen
    },
    hide() {
      this.groupIsOpen = false
    },
    async fetchData(id) {
      this.$root.globalModals.searchPreloader.showPreloader()
      this.hide()
      id = +id
      this.$store.commit('search/TOOGLE_CATEGORY_LOADING', true)
      this.$store.commit('search/TOOGLE_HASHTAG_LOADING', true)
      try {
        this.$store.commit('search/SET_INITIAL_CATEGORY_ID')
        this.$store.commit('search/SET_INITIAL_HASHTAG_ID')
        this.$store.commit('search/SET_HASHTAG_ID_BY_VALIDATE', [])
        this.$store.commit('search/SET_CATEGORY_ID_BY_VALIDATE', [])
        this.$store.commit('search/SET_GROUP_ID', id)
        await Promise.all([
          /**
           * Fetch dropdown data
           */
          this.$store.dispatch('search/FETCH_CATEGORY', {
            group_id: id === 0 ? null : id
          }),
          this.$store.dispatch('search/FETCH_HASHTAG', {
            group_id: id === 0 ? null : id
            // query: this.searchQuery
          }),
          /**
           * Fetch post data
           */
          this.$store.dispatch('search/FETCH_POST', {
            group_id: id === 0 ? null : id,
            sort_type: 'recent'
          }),
          this.$store.dispatch('search/FETCH_COMMENT', {
            group_id: id === 0 ? null : id,
            sort_type: 'recent'
          }),
          this.$store.dispatch('search/FETCH_GROUP_DATA', {
            group_id: id === 0 ? null : id
          }),
          this.$store.dispatch('search/FETCH_HASHTAG_DATA', {
            group_id: id === 0 ? null : id
          })
        ])
        this.mark()
      } catch (e) {
        throw e
      } finally {
        setTimeout(() => {
          this.$store.commit('search/TOOGLE_CATEGORY_LOADING', false)
          this.$store.commit('search/TOOGLE_HASHTAG_LOADING', false)
          this.$root.globalModals.searchPreloader.hidePreloader()
        }, 300)
      }
    }
  }
}
</script>
