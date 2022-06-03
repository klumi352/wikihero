<template>
  <div
    ref="postCreateGroupDropdown"
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
      <!-- Non scroll section -->
      <div class="select__search-wrap">
        <input
          id="searchField"
          ref="searchField"
          type="text"
          class="select__search a-ffr"
          name="search"
          :value="searchInput"
          autocomplete="off"
          @input="search($event)"
        />
        <span class="select__search-placeholder a-ffr">{{
          $t('post.select-placeholder')
        }}</span>
        <div class="select__icons-box">
          <button
            v-if="queryExist"
            class="select__search-clear"
            @click="clearSearch"
          >
            <icon-close />
          </button>
          <icon-search
            v-else
            class="select__search-icon"
            width="16"
            height="16"
          />
        </div>
      </div>
      <!-- --- -->
      <div class="select__modal-wrap">
        <!-- Preloader -->
        <div class="select__preloader">
          <img
            class="ico"
            width="60"
            height="60"
            src="~assets/svg/icon-preloader.svg"
            alt=""
          />
        </div>
        <!-- --- -->

        <!-- Follow list -->
        <div class="select__list-wrap">
          <span class="select__list-title a-ffb">{{
            $t('modal.group-you-follow')
          }}</span>
          <ul v-if="getFollowData" class="select__list">
            <li
              v-for="(item, index) in data.getSub"
              :key="index"
              class="select__item"
              :class="{
                selected: item.id === formValue.group_id
              }"
              @click="select(item)"
            >
              <img
                :src="item.logo.original_url"
                class="select__item-image"
                alt=""
              />
              <div class="select__item-info">
                <span class="select__item-title a-ffb">{{ item.title }}</span>
                <span class="select__item-amount a-ffr">{{
                  `${item.subscribers_count} ${$t('modal.members')}`
                }}</span>
              </div>
            </li>
          </ul>
          <span v-else class="select__no-result a-ffr">{{
            $t('modal-post-create.follow-no-result')
          }}</span>
        </div>
        <!-- --- -->

        <!-- Default list -->
        <div class="select__list-wrap mrg-top">
          <span class="select__list-title a-ffb">{{
            $t('modal.other-groups')
          }}</span>
          <ul v-if="getUnfollowData" class="select__list">
            <li
              v-for="(item, index) in data.getNoSub"
              :key="index"
              class="select__item"
              :class="{
                selected: item.id === formValue.group_id
              }"
              @click="select(item)"
            >
              <img
                :src="item.logo.original_url"
                class="select__item-image"
                alt=""
              />
              <div class="select__item-info">
                <span class="select__item-title a-ffb">{{ item.title }}</span>
                <span class="select__item-amount a-ffr">{{
                  `${item.subscribers_count} ${$t('modal.members')}`
                }}</span>
              </div>
            </li>
          </ul>
          <span v-else class="select__no-result a-ffr">{{
            $t('modal-post-create.no-result')
          }}</span>
        </div>
        <!-- --- -->
      </div>
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
      type: Object,
      default: () => {}
    },
    formValue: {
      type: Object
    },
    currentPage: {
      type: Boolean,
      default: false
    },
    storeValue: {
      type: Object,
      default: () => {}
    },
    error: {
      type: [String, Object]
    },
    searchInput: {
      type: String
    },
    searching: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      isChecked: false,
      title: ''
    }
  },
  computed: {
    queryExist() {
      return this.searchInput.length
    },
    hidePlaceholder() {
      return this.searchInput.length > 0
    },
    getGroupTitle() {
      return [...this.data.getNoSub, ...this.data.getSub].filter(
        (i) => i.id === this.formValue.group_id
      )[0]?.title
    },
    setSelectClasses() {
      return {
        openSelectGroupDropdown: this.isOpen,
        checked: this.isChecked,
        focused: this.queryExist,
        searched: this.searching,
        hidePlaceholder: this.hidePlaceholder
      }
    },
    getUnfollowData() {
      return this.data.getNoSub.length
    },
    getFollowData() {
      return this.data.getSub.length
    },
    setTitle() {
      return this.title || this.$t('modal-post-create.select-title')
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$refs.postCreateGroupDropdown

    if ((!this.currentPage || this.currentPage) && this.getGroupTitle) {
      this.title = this.getGroupTitle
      this.isChecked = true
      return
    }
    if (this.currentPage) {
      this.title = this.storeValue.title
      this.isChecked = true
    }
  },
  methods: {
    toogle() {
      this.isOpen = !this.isOpen
    },
    search(e) {
      this.$emit('input', e)
    },
    clearSearch() {
      this.$emit('input', { target: { value: '' } })
    },
    hide() {
      this.isOpen = false
    },
    select(v) {
      this.$emit('select', v)
      this.title = v.title
      this.isOpen = false
      this.isChecked = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'group-select';
</style>
