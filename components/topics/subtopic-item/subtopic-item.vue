<template>
  <li class="subtopic-item" :class="{ visible }">
    <button class="t-btn btn-arrow" @click="visible = !visible">
      <icon-arrow width="17px" height="17px" class="arrow" />
    </button>
    <nuxt-link :to="`/${$route.params.topic}/${it.slug}`" class="g-h2 title">
      <span>{{ it.name }}</span>
      <span class="button g-btn g-btn--dark">{{ $t('sub.view-nested') }}</span>
      <!-- <span class="counter a-ffr">{{
        3
          | pluralize(
            $t('sub.response-count'),
            $t('sub.response-count-pl'),
            true
          )
      }}</span> -->
    </nuxt-link>
    <!-- --- -->
    <div v-if="visible" class="list">
      <single-tip-list :slug="it.slug" />
    </div>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import SingleTipList from '@/components/common/single-tip-list/single-tip-list.vue'

export default Vue.extend({
  components: {
    SingleTipList
  },
  props: {
    it: Object
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState('tip', ['globalIsWorked', 'globalFilterType'])
  },
  watch: {
    globalFilterType() {
      this.visible = false
    },
    globalIsWorked() {
      this.visible = false
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'subtopic-item';
</style>
