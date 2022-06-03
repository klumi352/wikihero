<template>
  <section v-if="checkTypeSelected" class="list-box">
    <h3 class="list-box__title">{{ $t('search.comments') }}</h3>
    <div class="list-box__sorting-button-wrap a-df">
      <ul class="a-df a-aic">
        <li v-for="(item, index) in commentsTabs" :key="index" class="a-df">
          <button
            class="list-box__sorting-button a-ffr"
            :class="[{ checked: item.key === comment.type }]"
            @click="sortData(item)"
          >
            {{ item.value }}
          </button>
          <span v-if="index !== commentsTabs.length - 1" class="separator"
            >&#183;</span
          >
        </li>
      </ul>
    </div>
    <ul>
      <CommentItem
        v-for="(item, index) in comment.data"
        :key="index"
        :item="item"
      ></CommentItem>
    </ul>
    <div v-if="!comment.data.length" class="list-box__no-data">
      {{ $t('search.no-data') }}
    </div>
    <div class="a-df a-jcc">
      <v-pagination
        :meta="comment.meta"
        :loading="loading"
        @change="pagination"
      />
    </div>
  </section>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import { mapState, mapGetters } from 'vuex'
import CommentItem from '@/components/comments/item/item.vue'
export default {
  components: {
    CommentItem
  },
  data() {
    return {
      commentsTabs: [
        { key: 'recent', value: 'Commentaires récents', id: 3, slug: 'slug' },
        { key: 'trending', value: 'Tendances', id: 4, slug: 'slug' },
        { key: 'popular', value: 'Plus populaire', id: 5, slug: 'slug' }
      ],
      loading: false
    }
  },
  computed: {
    ...mapState('search', ['comment', 'modForType', 'selectedTypeValue']),
    checkTypeSelected() {
      return !this.modForType
        ? true
        : this.selectedTypeValue.some(
            ({ id }) => id === 'comment_type_selector'
          )
    }
  },
  methods: {
    async pagination({ page }) {
      try {
        this.loading = true
        await this.$store.dispatch('search/FETCH_COMMENT', {
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
        this.$store.commit('search/SET_COMMENT_SORT', i.key)
        await this.$store.dispatch('search/FETCH_COMMENT', {
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

<style lang="scss" scoped>
@import './comment-list.scss';
</style>
