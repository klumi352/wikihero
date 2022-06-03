<template>
  <div class="select" :class="{ adminUse: adminUse }">
    <div v-click-outside="outsideHandle" class="select__modal--wrap">
      <button
        :class="{ active: isOpen, checked: isChecked }"
        class="select__btn select__btn--default a-ffr"
        @click="isOpen = !isOpen"
      >
        {{ title ? title : selectTitle }}
        <icon-arrow class="arrow" />
      </button>
      <span v-if="error" class="error">{{ error }}</span>
      <div :class="{ open: isOpen }" class="select__modal--modal a-df a-fdc">
        <div class="select__modal--input-wrap">
          <v-input
            ref="el"
            placeholder-fade
            class="select__modal--search"
            :placeholder="$t('post.select-placeholder')"
            type="text"
            :value="searchInput"
            @input="searchHandler"
          />
          <icon-search
            class="select__modal--search-icon"
            width="16"
            height="16"
          />
        </div>

        <div class="select__modal--modal-wrap">
          <div class="select__modal--list-wrap withMargin">
            <span class="group-title a-ffb">{{
              $t('modal.group-you-follow')
            }}</span>
            <ul v-if="followLength()">
              <li
                v-for="(item, index) in followData.data"
                :key="index"
                :class="{ selected: item.isSelected || item.id === storeValue }"
                @click="handler(item)"
              >
                <img :src="item.logo.original_url" alt="" />
                <div class="info">
                  <span class="title a-ffb">{{ item.title }}</span>
                  <span class="amount a-ffr">{{
                    `${item.subscribers_count} ${$t('modal.members')}`
                  }}</span>
                </div>
              </li>
            </ul>
            <span v-else class="no-result a-ffr">{{
              $t('modal-post-create.follow-no-result')
            }}</span>
          </div>

          <div class="select__modal--list-wrap">
            <span class="group-title a-ffb">{{
              $t('modal.other-groups')
            }}</span>
            <ul v-if="dataLength()">
              <li
                v-for="(item, index) in filteredGroupsData.data"
                :key="index"
                :ref="`group-${index}`"
                :class="{
                  selected: item.isSelected || item.id === storeValue
                }"
                @click="handler(item)"
              >
                <img :src="item.logo.original_url" alt="" />
                <div class="info">
                  <span class="title a-ffb">{{ item.title }}</span>
                  <span class="amount a-ffr">{{
                    `${item.subscribers_count} ${$t('modal.members')}`
                  }}</span>
                </div>
              </li>
            </ul>
            <span v-else class="no-result a-ffr">{{
              $t('modal-post-create.no-result')
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-post-select';
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    listData: {
      type: Object,
      default: () => {}
    },
    followData: {
      type: Object,
      default: () => {}
    },
    selectTitle: {
      type: String
    },
    name: {
      type: String
    },
    searchInput: {
      type: String
    },
    storeValue: {
      type: Number
    },
    adminUse: {
      type: Boolean,
      default: false
    },
    error: {
      type: [String, Object]
    },
    secondName: {
      type: String
    },
    secondStoreValue: {
      type: Number
    }
  },
  data() {
    return {
      isOpen: false,
      title: '',
      isChecked: false,
      group_route: ''
    }
  },
  computed: {
    filteredGroupsData() {
      const data = []
      this.listData?.data?.map((group) =>
        this.followData?.data?.map((follow) => {
          if (group.id === follow.id) {
            data.push(group)
          }
        })
      )
      const list = this.listData?.data?.filter((i) => !data.includes(i))

      return { data: list }
    }
  },
  watch: {
    listData: {
      immediate: true,
      deep: true,
      handler({ data }: any) {
        const selected: any = data.find(({ id }: any) => {
          return id === this.storeValue
        })
        if (!selected) return
        this.title = selected?.title
        this.isChecked = true
        this.group_route = selected?.computed_slug
      }
    },
    followData: {
      immediate: true,
      deep: true,
      handler({ data }: any) {
        const selected: any = data.find(({ id }: any) => {
          return id === this.storeValue
        })
        if (!selected) return
        this.title = selected?.title
        this.isChecked = true
        this.group_route = selected?.computed_slug
      }
    }
  },
  created() {
    if (!this.adminUse && this.storeValue) {
      this.$emit('select', {
        name: this.name,
        value: this.storeValue,
        group_path: this.group_route
      })
    }
  },
  methods: {
    handler(v: any) {
      this.clearSelectedClass('listData')
      this.clearSelectedClass('followData')
      this.$emit('select', {
        name: this.name,
        value: v.id,
        sec_name: this.secondName,
        sec_value: v.topic.id,
        group_path: v?.computed_slug
      })
      this.title = v?.title
      this.isOpen = false
      this.isChecked = true
      v.isSelected = true
    },
    searchHandler(e: any) {
      this.$emit('input', e)
    },
    outsideHandle() {
      this.isOpen = false
    },
    dataLength() {
      const vm = this as any
      return vm.listData?.data?.length > 0
    },
    followLength() {
      const vm = this as any
      return vm.followData?.data?.length > 0
    },
    clearSelectedClass(o: any) {
      const vm = this as any
      vm[o]?.data?.forEach((i: any) => (i.isSelected = false))
    }
  }
})
</script>
