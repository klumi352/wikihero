<template>
  <div>
    <h1>
      {{ $t('global.statistic') }}
    </h1>
    <br />
    <active-users />
    <validate-tip />
    <search-result />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ActiveUsers from '@/components/statistic/active-users/active-users.vue'
import ValidateTip from '@/components/statistic/validate-tip/validate-tip.vue'
import SearchResult from '@/components/statistic/search-result/search-result.vue'

export default Vue.extend({
  watchQuery: false,
  components: {
    ActiveUsers,
    ValidateTip,
    SearchResult
  }
})
</script>

<style lang="scss"></style>
