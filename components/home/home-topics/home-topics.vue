<template>
  <section class="g-container container">
    <div class="wrapper">
      <div class="a-m-15-30 a-tal g-h3">{{ $t('home.topic-title') }}</div>
      <ul class="items">
        <li v-for="topic in data.data" :key="topic.id" class="item">
          <nuxt-link :to="`/${topic.slug}`" class="link">
            <span class="g-h2 a-mtb-0 name">{{ topic.name }}</span>
            <div class="tips">
              <span class="g-h3 a-mtb-0 tip">{{
                topic.count_tips | pluralize($t('home.tip'), $t('home.tip-plu'))
              }}</span>
            </div>
          </nuxt-link>
        </li>
      </ul>
      <v-pagination
        class="buttons"
        :meta="data.meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async pagination({ page }: any) {
      this.loading = true
      await (this.$parent as any).loadMoreOverall({ page })
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'home-topics';
</style>
