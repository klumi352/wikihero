<template>
  <section class="container">
    <div class="wrapper">
      <v-tab
        wide
        drop-mode
        name="filter-tip"
        :disabled="loadingTab"
        :items="$t('tab.topic-filter-names').split(',')"
        :hints="$t('tab.topic-filter-hints').split(',')"
        @change="tabChange"
      />
      <div class="list-wrap">
        <ul v-if="list.length" class="list">
          <!-- with-blank -->
          <topic-item v-for="(topic, i) in data.data" :key="i" :topic="topic">
            <div class="g-h3 contribution">
              {{
                topic.count_new_contributions
                  | pluralize(
                    $t('profile.new-contr'),
                    $t('profile.new-contr-plu')
                  )
              }}
            </div>
          </topic-item>
        </ul>
        <div v-else class="not-found">
          <div v-if="loaded">
            <img :src="$t(`$i.profile-wait.url`)" width="300" alt="" />
            <h2>{{ $t(`profile.empty-topic-${currSort}`) }}</h2>
            <nuxt-link
              :to="$t(`profile.empty-topic-${currSort}-link`)"
              class="g-btn"
              >{{ $t(`profile.empty-topic-${currSort}-btn`) }}</nuxt-link
            >
          </div>
        </div>
        <div class="preloading" :class="[{ show: loadingTab }]">
          <img
            class="ico"
            width="60"
            height="60"
            src="~assets/svg/icon-preloader.svg"
            alt=""
          />
        </div>
      </div>
      <v-pagination
        class="buttons"
        :meta="data.meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { Api } from '@/api.config'
import TopicItem from '@/components/topics/topic-item/topic-item.vue'
export default Vue.extend({
  components: {
    TopicItem
  },
  data() {
    return {
      loaded: false,
      currSort: 'all',
      loading: false,
      loadingTab: true,
      data: {}
    }
  },
  computed: {
    list() {
      return this.data.data || []
    },
    meta() {
      return this.data.meta || null
    }
  },
  created() {
    if (process.server) return

    this.getData()
  },
  methods: {
    async getData({
      sort = (() => this.currSort)(),
      perPage = process.env.PROFILE_TOPICS_PER_PARE,
      page = 1
    } = {}) {
      const vm = this
      try {
        const data = await vm.$axios.get(Api.client.TOPIC_PROFILE_ALL, {
          params: {
            sort_by: sort,
            perPage,
            page
          }
        })
        vm.loaded = true
        if (page > 1) {
          vm.data.data.push(...data.data)
          vm.data.meta = data.meta
        } else {
          vm.data = data
        }
      } finally {
        setTimeout(() => {
          vm.loadingTab = false
        }, 400)
      }
    },
    pagination({ page }) {
      this.loading = true
      this.getData({ page }).finally(() => {
        this.loading = false
      })
    },
    tabChange({ index }) {
      const vm = this
      vm.loadingTab = true
      ;(() => {
        switch (index) {
          case 0: {
            this.currSort = 'all'
            return this.getData()
          }
          case 1: {
            this.currSort = 'topic'
            return this.getData()
          }
          case 2: {
            this.currSort = 'sub-topic'
            return this.getData()
          }
          default: {
            return Promise.resolve()
          }
        }
      })().finally(() => {
        setTimeout(() => (vm.loadingTab = false), 300)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'all-topics';
</style>
