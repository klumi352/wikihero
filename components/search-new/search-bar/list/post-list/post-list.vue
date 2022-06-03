<template>
  <section v-if="checkTypeSelected" class="list-box">
    <h3 class="list-box__title">{{ $t('search.posts') }}</h3>
    <div class="list-box__sorting-button-wrap a-df">
      <ul class="a-df a-aic">
        <li v-for="(item, index) in postsTabs" :key="index" class="a-df">
          <button
            class="list-box__sorting-button a-ffr"
            :class="[{ checked: item.key === post.type }]"
            @click="sortData(item)"
          >
            {{ item.value }}
          </button>
          <span v-if="index !== postsTabs.length - 1" class="separator"
            >&#183;</span
          >
        </li>
      </ul>
    </div>
    <ul class="a-df a-fdc">
      <PostItem
        v-for="(item, index) in post.data"
        :key="index"
        force-open
        :post="item"
      ></PostItem>
    </ul>
    <div v-if="!post.data.length" class="list-box__no-data">
      {{ $t('search.no-data') }}
    </div>
    <div class="a-df a-jcc">
      <v-pagination :meta="post.meta" :loading="loading" @change="pagination" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import './post-list.scss';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable require-await */
/* eslint-disable no-constant-condition */
import { mapState } from 'vuex'
import PostItem from '@/components/common/post-component/post-item.vue'
export default {
  components: {
    PostItem
  },
  data() {
    return {
      postsTabs: [
        { key: 'recent', value: 'Posts Récents' },
        { key: 'trending', value: 'Tendances' },
        { key: 'popular', value: 'Plus populaire' }
      ],
      loading: false
    }
  },
  computed: {
    ...mapState('search', [
      'postDataCollection',
      'postMetaObject',
      'postSortType',
      'post',
      'selectedTypeValue',
      'modForType'
    ]),
    checkTypeSelected() {
      return !this.modForType
        ? true
        : this.selectedTypeValue.some(({ id }) => id === 'post_type_selector')
    }
  },
  methods: {
    async pagination({ page }) {
      try {
        this.loading = true
        await this.$store.dispatch('search/FETCH_POST', {
          page
        })
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async sortData(i) {
      try {
        this.$root.globalModals.searchPreloader.showPreloader()
        this.$store.commit('search/SET_POST_SORT', i.key)
        await this.$store.dispatch('search/FETCH_POST', {
          sort_type: i.key
        })
      } catch (e) {
        throw e
      } finally {
        setTimeout(() => {
          this.$root.globalModals.searchPreloader.hidePreloader()
        }, 700)
      }
    }
  }
}
</script>
