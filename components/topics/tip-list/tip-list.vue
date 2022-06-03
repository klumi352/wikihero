<template>
  <section class="container">
    <div v-if="!isNoGroup">
      <div class="head g-h2 a-mt-40-80">
        {{ $t('tip.result') }}
      </div>
      <div class="filter-tabs-wrap">
        <v-tab
          ref="tab"
          drop-mode
          without-bottom-line
          class="filter-tabs"
          :default-checked="defaultChecked"
          name="filter-tip"
          :disabled="loadingForFilter"
          :items="$t('tip.filters').split(',')"
          @change="filterChange"
        />
      </div>
      <v-tab
        wide
        half-in-mobile
        name="work-tip"
        :disabled="loadingForWorked"
        :items="[
          $t('tip.btn-work', { count: localMeta.count_worked_tips }),
          $t('tip.btn-dont-work', { count: localMeta.count_avoid_tips })
        ]"
        @change="workedChange"
      />
    </div>
    <div v-else class="no-group">
      <div class="head g-h2">
        {{ $t('tip.result') }}
      </div>
      <v-tab
        ref="tab"
        drop-mode
        :default-checked="defaultChecked"
        name="filter-tip"
        :disabled="loadingForFilter"
        :items="$t('tip.filters').split(',')"
        @change="filterChange"
      />
    </div>
    <div v-if="localList.length" class="wrapper">
      <ul class="list">
        <single-tip-wrapper
          v-for="item in localList"
          :key="item.id"
          :it="item"
        />
      </ul>
      <div class="suggest-wrap">
        <nuxt-link class="g-btn g-btn--link" append to="#contribute-tip">
          <icon-plus /> {{ $t('tip.contribute') }}
        </nuxt-link>
      </div>
      <v-pagination
        class="buttons"
        :meta="meta"
        :loading="loadingForPagination"
        @change="pagination"
      />
    </div>
    <div v-else class="not-found">
      <h3>{{ $t(`tip.empty-${globalFilterType}`) }}</h3>
      <button
        v-if="globalFilterType !== 'alpha'"
        class="g-btn"
        @click="
          filterChange({ index: redirectChecked }).then(() =>
            $refs.tab.$emit('force-change', redirectChecked)
          )
        "
      >
        {{ $t(`tip.empty-btn`) }}
      </button>
      <nuxt-link v-else class="g-btn" append to="#contribute-tip">
        {{ $t('sharer.create-tip') }}
      </nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { redirectChecked } from '@/store/tip'
import SingleTipWrapper from '@/components/common/single-tip-wrapper/single-tip-wrapper.vue'

export default Vue.extend({
  components: {
    SingleTipWrapper
  },
  localObserver() {
    return {
      single: () => this.$el
    }
  },
  data() {
    return {
      redirectChecked,
      loadingForFilter: false,
      loadingForWorked: false,
      loadingForPagination: false
    } as {
      loadingForFilter: boolean
      loadingForWorked: boolean
      loadingForPagination: boolean
    }
  },
  computed: {
    localMeta() {
      return this.meta
    },
    localList() {
      return this.list
    },
    ...mapState('topic', ['topic']),
    ...mapGetters('topic', ['isNoGroup']),
    ...mapState('tip', ['globalIsWorked', 'globalFilterType']),
    ...mapGetters('tip', ['list', 'meta', 'defaultChecked'])
  },
  methods: {
    getWithFilter({
      sort = (() => this.globalFilterType)(),
      worked = (() => this.globalIsWorked)(),
      page
    }: any): any {
      return this.$store.dispatch('tip/findBySubtopic', {
        slug: this.$route.params.subtopic,
        worked,
        sort,
        page
      })
    },
    workedChange({ index }: any) {
      const vm = this as any
      vm.loadingForWorked = true

      return new Promise((resolve) => {
        ;(() => {
          switch (index) {
            case 0: {
              return vm.getWithFilter({ worked: true })
            }
            case 1: {
              return vm.getWithFilter({ worked: false })
            }
            default: {
              return Promise.resolve()
            }
          }
        })().finally(() => {
          vm.loadingForWorked = false
          resolve()
        })
      })
    },
    filterChange({ index }: any) {
      const vm = this as any

      vm.loadingForFilter = true
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
          vm.loadingForFilter = false
          resolve()
        })
      })
    },
    pagination({ page }: any): void {
      const vm = this as any
      vm.loadingForPagination = true
      vm.getWithFilter({ page }).finally(() => {
        vm.loadingForPagination = false
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'tip-list';
</style>
