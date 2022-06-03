<template>
  <div v-if="checkTypeSelected" class="list-box">
    <h3 class="list-box__title">{{ $t('search.hashtags') }}</h3>
    <ul>
      <HashtagItem
        v-for="(item, index) in hashtagData.data"
        :key="index"
        :item="item"
      ></HashtagItem>
    </ul>
    <div v-if="!hashtagData.data.length" class="list-box__no-data">
      {{ $t('search.no-data') }}
    </div>
    <div class="a-df a-jcc">
      <v-pagination
        :meta="hashtagData.meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import { mapGetters, mapState } from 'vuex'
import HashtagItem from '@/components/hashtags/item/item'
export default {
  components: {
    HashtagItem
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('search', ['hashtagData', 'modForType', 'selectedTypeValue']),
    checkTypeSelected() {
      return !this.modForType
        ? true
        : this.selectedTypeValue.some(
            ({ id }) => id === 'hashtagData_type_selector'
          )
    }
  },
  methods: {
    async pagination({ page }) {
      try {
        this.loading = true
        await this.$store.dispatch('search/FETCH_HASHTAG_DATA', {
          page
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

<style lang="scss" scoped>
.list-box {
  margin-top: 50px;

  &__title {
    line-height: 1.2;
    color: var(--c-black);
    letter-spacing: 0.01em;
    font-family: $f-medium;

    @include fluid-size('margin-bottom', 25px, 42px);
    @include fluid-size('font-size', 22px, 27px);
  }

  &__no-data {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
