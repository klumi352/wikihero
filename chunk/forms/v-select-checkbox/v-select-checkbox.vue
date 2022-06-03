<template>
  <div class="select" :class="{ adminUse: adminUse, search_page: mod }">
    <div v-click-outside="outsideHandle" class="select__modal--wrap">
      <button
        :class="{ active: isOpen, checked: isChecked }"
        class="select__btn a-ffr"
        @click="open"
      >
        {{ title }}
        <icon-arrow class="arrow" />
        <icon-close v-if="mod" class="close arrow" />
      </button>
      <span v-if="error" class="error">{{ error }}</span>
      <div :class="{ open: isOpen }" class="select__modal--modal small">
        <div class="select__modal--modal-subwrap">
          <ul v-if="dataLength()">
            <li
              v-for="(item, index) in listData.data"
              v-show="!tempUser || item.key !== 'following'"
              :key="index"
            >
              <v-controll
                class="radio"
                type="radio"
                :name="name"
                :value="item.title || item.value"
                :checked="
                  storeValue === item.id
                    ? (item.isChecked = true)
                    : (item.isChecked = false)
                "
                @input="handleChange($event, item)"
              />
              <div>
                <span class="title-small a-ffr">
                  {{ item.title || item.value }}
                </span>
                <span class="description a-ffr">{{ item.description }}</span>
              </div>
            </li>
          </ul>
          <span v-else class="no-result a-ffr">{{ $t('post.no-data') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-select-checkbox';
</style>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    selectedId: Number,
    mod: {
      type: Boolean
    },
    modificatorGroupPage: {
      type: Boolean,
      default: false
    },
    isFilter: {
      type: Boolean
    },
    listData: {
      type: [Array, Object]
    },
    selectTitle: {
      type: String
    },
    name: {
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
    editMode: Boolean,
    modificator: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: '',
      isOpen: false,
      isChecked: false
    }
  },
  watch: {
    listData: {
      deep: true,
      handler() {
        if (!this.modificator) this.takeName()
      }
    },
    selectedId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.takeNameMod(val)
          this.isChecked = true
          this.$emit('check', {
            name: this.name,
            value: val
          })
        }
      }
    }
  },
  created() {
    if (!this.selectedId) {
      this.title = this.selectTitle
      if (this.storeValue !== null && !this.modificatorGroupPage) {
        this.$emit('check', {
          name: this.name,
          value: this.storeValue
        })
        this.takeName()
      }
    }
    if (this.editMode) this.isChecked = true
  },
  computed: {
    ...mapGetters('auth', ['tempUser'])
  },
  methods: {
    handleChange(e: any, v: any) {
      this.title = e.target.value
      this.isChecked = true
      this.$emit('check', {
        name: e.target.name,
        value: v.id
      })
      if (this.mod) this.outsideHandle() // for result page
    },
    open() {
      if (this.mod && this.isChecked && !this.isFilter) {
        // for search result page
        if (!this.isFilter) {
          this.title = this.selectTitle
          this.isChecked = false
        }
        this.$emit('check', '')
      } else this.isOpen = !this.isOpen
    },
    takeName() {
      const selected: any = Array.from(this.listData.data)
        .filter((item) => item.title)
        .find((i: any) => i.id === this.storeValue)
      if (selected) {
        this.title = selected?.title
        this.isChecked = true
      } else {
        this.title = this.selectTitle
        this.isChecked = false
      }
    },
    takeNameMod(id) {
      const selected: any = Array.from(this.listData.data)
        .filter((item) => item.slug)
        .find((i: any) => i.id === id)
      if (selected) {
        this.title = selected?.title
        this.isChecked = true
      }
    },
    outsideHandle() {
      this.isOpen = false
    },
    dataLength() {
      const vm = this as any
      return vm.listData?.data?.length > 0
    }
  }
})
</script>
