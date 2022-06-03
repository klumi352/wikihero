<template>
  <section class="container">
    <div v-if="slug" class="preloading" :class="[{ show: loading }]">
      <img width="60" height="60" src="~assets/svg/icon-preloader.svg" alt="" />
    </div>
    <div v-if="localList.length" class="wrapper">
      <ul class="list">
        <single-tip-wrapper
          v-for="item in localList"
          :key="item.id"
          :it="item"
        />
      </ul>
    </div>
    <div v-else class="not-found">
      <h3>{{ $t(`tip.common-empty`) }}</h3>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { filterTypes } from '@/store/tip'
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
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      localData: null
    }
  },
  computed: {
    localMeta() {
      return this.localData?.meta || null
    },
    localList() {
      return this.localData?.data || []
    },
    ...mapState('tip', ['globalIsWorked', 'globalFilterType']),
    ...mapGetters('tip', ['list', 'meta', 'defaultChecked'])
  },
  created() {
    const vm = this as any
    vm.loading = true
    vm.$store
      .dispatch('tip/findBySubtopic', {
        worked: vm.globalIsWorked,
        sort: filterTypes.ALPHA,
        withoutCommit: true,
        slug: vm.slug,
        page: 1
      })
      .then((response: any) => {
        // eslint-disable-next-line no-console
        vm.localData = response
      })
      .finally(() => {
        setTimeout(() => {
          vm.loading = false
        }, 300)
      })
  }
})
</script>

<style lang="scss" scoped>
@import 'single-tip-list';
</style>
