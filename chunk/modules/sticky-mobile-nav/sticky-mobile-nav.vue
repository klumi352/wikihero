<template>
  <div class="sticky-mobile-nav">
    <ul class="list">
      <li class="item">
        <button
          class="link"
          @click="() => $store.commit(`ui/${mt.SET_VISIBILITY}`, !0)"
        >
          <span class="ico-wrap">
            <icon-menu class="ico" width="22" height="22" />
          </span>
          <span>{{ $t('mobile-nav.menu') }}</span>
        </button>
      </li>
      <li class="item">
        <nuxt-link class="link" to="/search">
          <span class="ico-wrap">
            <icon-search class="ico" width="17" height="17" />
          </span>
          <span>{{ $t('mobile-nav.search-result') }}</span>
        </nuxt-link>
      </li>
      <li class="item">
        <nuxt-link class="link" to="/feed">
          <span class="ico-wrap">
            <icon-glass class="ico glass" width="29" height="12" />
          </span>
          <span>{{ $t('mobile-nav.news') }}</span>
        </nuxt-link>
      </li>
      <li class="item">
        <button
          class="link"
          @click="
            () => {
              $root.globalModals.createPost.open()
            }
          "
        >
          <span class="ico-wrap">
            <icon-plus-2 class="ico" width="20" height="20" />
          </span>
          <span>{{ $t('mobile-nav.add-tip') }}</span>
        </button>
      </li>
      <!-- Temporary comment -->
      <!-- <li class="item">
        <button
          class="link"
          @click="() => $root.globalModals.askQuestion.open()"
        >
          <span class="ico-wrap">
            <icon-question class="ico" width="16" height="16" />
          </span>
          <span>{{ $t('mobile-nav.ask') }}</span>
        </button>
      </li> -->
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mt } from '@/store/ui'

export default Vue.extend({
  data() {
    return { mt }
  }
})
</script>

<style lang="scss" scoped>
@import 'sticky-mobile-nav';
</style>
