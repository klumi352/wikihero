<template>
  <div
    v-click-outside="outsideHandle"
    class="hashtag a-df"
    :class="{ adminUse: adminUse }"
  >
    <div class="a-df">
      <div class="hashtag__select-list-wrap a-df a-aic">
        <ul class="hashtag__select-list a-df">
          <li
            v-for="(hashtag, index) in storeValue"
            :key="index"
            class="hashtag__select-item a-ffr"
          >
            {{ hashtag }}
            <button
              @click="DELETE_HASHTAG({ value: hashtag, obj: stateObj })"
            ></button>
          </li>
        </ul>
      </div>
    </div>

    <div style="position: relative; flex-grow: 1">
      <v-input
        v-if="!hashtagsLength({ obj: stateObj })"
        ref="hashtagInput"
        class="hashtag__hashtag-input"
        :value="inputValue"
        name="hashtag"
        :placeholder="$t('modal.add-hashtags')"
        type="text"
        @input="
          searchHandle($event)
          isOpen = true
        "
        @keypress.enter="setHashtag($event)"
        @keydown.delete="removeLastTag($event)"
        @focus="emitEvent"
      />
    </div>

    <div class="hashtag__test">
      <div
        :class="{
          open: isOpen && !hashtagsLength({ obj: stateObj })
        }"
        class="hashtag__modal"
      >
        <div class="hashtag__modal-subwrap">
          <ul v-if="checkDataLength">
            <li
              v-for="(item, index) in hashtagsList.data"
              :key="index"
              @click="selectHandle(item)"
            >
              <div>
                <span class="hashtag__title-small a-ffr">{{ item.name }}</span>
                <span class="hashtag__description a-ffr">{{
                  item.description
                }}</span>
              </div>
            </li>
          </ul>
          <span v-else class="hashtag__no-result a-ffr">{{
            $t('modal.no-result')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-select-search-for-hashtag';
</style>

<script lang="ts">
import { mapMutations, mapGetters } from 'vuex'
import Vue from 'vue'
export default Vue.extend({
  props: {
    inputValue: {
      type: String
    },
    name: {
      type: String
    },
    hashtagsList: {
      type: Object,
      default: () => {}
    },
    storeValue: {
      type: Array,
      default: () => []
    },
    adminUse: {
      type: Boolean,
      default: false
    },
    stateObj: {
      type: String
    },
    error: {
      type: [String, Object]
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    searchHandle(e: any) {
      this.$emit('input', e)
    },
    selectHandle(v: any) {
      this.$emit('select', v.name)
    },
    setHashtag(e: any) {
      this.$emit('key-press', e.target.value)
    },
    outsideHandle() {
      this.isOpen = false
    },
    ...mapMutations('post', ['DELETE_HASHTAG']),
    removeLastTag(e: any) {
      this.$emit('delete', e)
    },
    emitEvent() {
      this.$emit('focus')
      this.isOpen = true
    }
  },
  computed: {
    ...mapGetters('post', ['hashtagsLength']),
    checkDataLength() {
      return this.hashtagsList.data.length > 0
    }
  }
})
</script>
