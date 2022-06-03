<template>
  <div class="feed__result">
    <div class="feed__current-week">
      <ul>
        <item
          v-for="(item, index) in getThisWeek"
          :key="index"
          force-open
          :post="item"
        ></item>
        <li v-if="!getThisWeek.length" class="feed__current-week__noResult">
          <span>{{ $t('search.no-data') }}</span>
        </li>
      </ul>

      <v-pagination
        v-if="getThisWeek.length"
        class="feed__pagination"
        :meta="posts.this_week.meta"
        :loading="loading"
        @change="
          pagination($event, { key: 'this_week', api: '/posts/for-this-week' })
        "
      />
    </div>

    <div class="feed__last-week">
      <h3 class="feed__section-header">{{ $t('feed.section-week') }}</h3>
      <ul>
        <item
          v-for="(item, index) in getLastWeek"
          :key="index"
          force-open
          :post="item"
        ></item>
        <li v-if="!getLastWeek.length" class="feed__current-week__noResult">
          <span>{{ $t('search.no-data') }}</span>
        </li>
      </ul>

      <v-pagination
        v-if="getLastWeek.length"
        class="feed__pagination"
        :meta="posts.last_week.meta"
        :loading="loading"
        @change="
          pagination($event, { key: 'last_week', api: '/posts/for-last-week' })
        "
      />
    </div>

    <div class="feed__rest-of-month">
      <h3 class="feed__section-header">{{ $t('feed.section-month') }}</h3>
      <ul>
        <item
          v-for="(item, index) in getRestMonth"
          :key="index"
          force-open
          :post="item"
        ></item>

        <li v-if="!getRestMonth.length" class="feed__current-week__noResult">
          <span>{{ $t('search.no-data') }}</span>
        </li>
      </ul>

      <v-pagination
        v-if="getRestMonth.length"
        class="feed__pagination"
        :meta="posts.rest_month.meta"
        :loading="loading"
        @change="
          pagination($event, {
            key: 'rest_month',
            api: '/posts/for-rest-month'
          })
        "
      />
    </div>

    <!-- @@@ modals -->
    <flag-tip />
    <share-tip />
    <!-- --- -->
  </div>
</template>

<style lang="scss" scoped>
@import 'feed-result';
</style>

<script>
/* eslint-disable prefer-const */
/* eslint-disable no-useless-catch */
import { mapState, mapGetters } from 'vuex'
import Item from '@/components/common/post-component/post-item'
// @@@ modals
import FlagTip from '@/components/topics/__modals/flag-tip/flag-tip.vue'
import ShareTip from '@/components/topics/__modals/share-tip/share-tip.vue'

export default {
  components: {
    Item,
    FlagTip,
    ShareTip
  },
  props: {
    filters: {
      type: Object
    },
    sort: {
      type: String
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('feed', ['posts']),
    ...mapGetters('feed', ['getThisWeek', 'getLastWeek', 'getRestMonth'])
  },
  methods: {
    async pagination({ page }, { key, api }) {
      try {
        this.loading = true
        const params = {
          per_page: process.env.NEW_FEED_PER_PAGE,
          page,
          order_by: this.sort,
          hashtags_id: this.filters?.h || [],
          categories_id: this.filters?.c || []
        }
        let { data, meta } = await this.$axios.get(api, {
          params
        })
        data = data.map((item) => ({
          ...item,
          currentStep: 0,
          showPreview: true,
          is_worked: false
        }))
        this.$store.commit('feed/UPDATE_POST', {
          key,
          value: { data, meta }
        })
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
