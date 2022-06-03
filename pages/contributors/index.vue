<template>
  <div>
    <layout-wide class="g-aside-container">
      <template v-slot:default>
        <contributors-baner></contributors-baner>
        <contributors-list :contributors-list="listData"></contributors-list>
      </template>
    </layout-wide>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
import { mapState } from 'vuex'
import ContributorsBaner from '@/components/contributors/baner/contributors-baner.vue'
import ContributorsList from '@/components/contributors/contributors-list/contributors-list.vue'

export default {
  components: {
    ContributorsBaner,
    ContributorsList
  },
  async asyncData({ store, error }) {
    try {
      await store.dispatch('contributors/GET_CONTRIBUTORS_DATA')
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  computed: {
    ...mapState('contributors', ['listData'])
  }
}
</script>
