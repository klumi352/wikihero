<template>
  <section class="container">
    <h3 class="head">{{ $t('sub.list-name') }}</h3>
    <div v-if="nestedList && nestedList.length" class="wrapper">
      <ul>
        <li
          is="subtopic-item"
          v-for="item of nestedList"
          :key="item.id"
          :it="item"
        ></li>
      </ul>
      <div class="create-btn-wrap">
        <nuxt-link class="g-btn g-btn--link" append to="#create-topic">
          <icon-plus /> {{ $t('sub.request-new') }}
        </nuxt-link>
      </div>
      <v-pagination
        class="buttons"
        :meta="nestedMeta"
        :loading="loading"
        @change="pagination"
      />
    </div>
    <div v-else class="not-found">
      <h3>{{ $t('sub.empty-nested') }}</h3>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SubtopicItem from '../subtopic-item/subtopic-item.vue'

export default Vue.extend({
  components: {
    SubtopicItem
  },
  localObserver() {
    return {
      single: () => this.$el
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('topic', ['nestedList', 'nestedMeta'])
  },
  methods: {
    pagination({ page }: any) {
      this.loading = true
      this.$store
        .dispatch('topic/getNestedSubtopics', {
          slug: this.$route.params.subtopic,
          page
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'subtopic-list';
</style>
