<template>
  <section class="container">
    <div class="wrapper">
      <v-tab
        ref="tab"
        wide
        small
        name="filter-tip"
        :default-checked="defaultChecked"
        :disabled="loadingTab"
        :items="$t('topic.filters').split(',')"
        @change="filterChange"
      />
      <div v-if="subtopicsList" class="">
        <ul class="list">
          <topic-item
            v-for="(topic, i) in subtopicsList"
            :key="i"
            :topic="topic"
          />
        </ul>
        <v-pagination
          class="buttons"
          :meta="subtopicsMeta"
          :loading="loading"
          @change="pagination"
        />
      </div>
      <div v-else class="not-found">
        <h3>{{ $t(`topic.empty-${currentSort}`) }}</h3>
        <button
          v-if="currentSort !== 'alpha'"
          class="g-btn"
          @click="
            filterChange({ index: redirectChecked }).then(() =>
              $refs.tab.$emit('force-change', redirectChecked)
            )
          "
        >
          {{ $t(`topic.empty-btn`) }}
        </button>
        <nuxt-link v-else class="g-btn" append to="#create-topic">
          {{ $t('sharer.create-subtopic') }}
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import TopicItem from '../topic-item/topic-item.vue'
import { defaultChecked, redirectChecked } from '@/store/topic'

export default Vue.extend({
  components: {
    TopicItem
  },
  props: {
    getWithFilter: Function,
    currentSort: String
  },
  data() {
    return {
      defaultChecked,
      redirectChecked,
      loading: false,
      loadingTab: false
    }
  },
  computed: {
    ...mapState('topic', []),
    ...mapGetters('topic', ['subtopicsList', 'subtopicsMeta'])
  },
  methods: {
    ...mapActions('topic', ['changeFollow']),
    pagination({ page }: any) {
      this.loading = true
      this.getWithFilter({ page }).finally(() => {
        this.loading = false
      })
    },
    filterChange({ index }: any) {
      const vm = this
      vm.loadingTab = true

      return new Promise((resolve) => {
        ;(() => {
          switch (index) {
            case 0: {
              return vm.getWithFilter({ sort: 'top' })
            }
            case 1: {
              return vm.getWithFilter({ sort: 'trend' })
            }
            case 2: {
              return vm.getWithFilter({ sort: 'new' })
            }
            case 3: {
              return vm.getWithFilter({ sort: 'alpha' })
            }
            default: {
              return Promise.resolve()
            }
          }
        })().finally(() => {
          vm.loadingTab = false
          resolve()
        })
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'topic-list';
</style>
