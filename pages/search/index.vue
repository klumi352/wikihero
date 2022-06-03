<template>
  <div>
    <layout-3>
      <!--  -->
      <SearchBar></SearchBar>
      <!--  -->
      <PostList></PostList>
      <!--  -->
      <CommentList></CommentList>
      <!--  -->
      <GroupList></GroupList>
      <!--  -->
      <HashtagList></HashtagList>
      <!--  -->

      <!-- Modals -->
      <share-tip />
      <flag-tip />
      <validating-tip />
      <CommentCreate />
      <!--  -->
    </layout-3>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable require-await */
/* eslint-disable no-constant-condition */
import Mark from 'mark.js'
import { mapState, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import SearchBar from '@/components/search-new/search-bar/search-bar.vue'
import PostList from '@/components/search-new/search-bar/list/post-list/post-list.vue'
import CommentList from '@/components/search-new/search-bar/list/comment-list/comment-list.vue'
import GroupList from '@/components/search-new/search-bar/list/group-list/group-list.vue'
import HashtagList from '@/components/search-new/search-bar/list/hashtag-list/hashtag-list.vue'

import ShareTip from '@/components/topics/__modals/share-tip/share-tip.vue'
import CommentCreate from '@/components/topics/__modals/comment-create/comment-create.vue'
import FlagTip from '@/components/topics/__modals/flag-tip/flag-tip.vue'
import ValidatingTip from '@/components/topics/__modals/validating-tip/validating-tip.vue'

export default {
  components: {
    SearchBar,
    PostList,
    CommentList,
    GroupList,
    HashtagList,
    ShareTip,
    FlagTip,
    ValidatingTip,
    CommentCreate
  },
  async asyncData({ store, query, error }) {
    try {
      store.commit('search/SET_GROUP_ID', +query.group_id || 0)
      store.commit('search/SET_SEARCH_QUERY', query.search)
      store.commit('search/SET_CATEGORY_ID_BY_VALIDATE', [])
      store.commit('search/SET_HASHTAG_ID_BY_VALIDATE', [])
      store.commit('search/SET_INITIAL_CATEGORY_ID')
      store.commit('search/SET_INITIAL_HASHTAG_ID')
      await Promise.all([
        /**
         * Fetch asyncData dropdown
         */
        store.dispatch('search/FETCH_GROUP'),
        store.dispatch('search/FETCH_CATEGORY', {
          group_id: store.getters['search/setGroupId']
        }),
        store.dispatch('search/FETCH_HASHTAG', {
          group_id: store.getters['search/setGroupId']
        })
      ])
      if (query.hashtag_id) {
        const current_hashtag = store.state.search.hashtag.find(
          ({ id }) => id === +query.hashtag_id
        )
        store.commit('search/SET_HASHTAG_ID_BY_VALIDATE', [current_hashtag])
        store.commit('search/ADD_FILTER_HASHTAG_ID', current_hashtag)
      }
      if (query.category_id) {
        const current_category = store.state.search.category.find(
          ({ id }) => id === +query.category_id
        )
        store.commit('search/SET_CATEGORY_ID_BY_VALIDATE', [current_category])
        store.commit('search/ADD_FILTER_CATEGORY_ID', current_category)
      }
      await Promise.all([
        /**
         * Fetch asyncData content
         */
        store.dispatch('search/FETCH_POST', {
          group_id: store.getters['search/setGroupId']
        }),
        store.dispatch('search/FETCH_COMMENT', {
          group_id: store.getters['search/setGroupId']
        }),
        store.dispatch('search/FETCH_GROUP_DATA', {
          group_id: store.getters['search/setGroupId']
        }),
        store.dispatch('search/FETCH_HASHTAG_DATA', {
          group_id: store.getters['search/setGroupId']
        })
      ])
    } catch (e) {
      error({ statusCode: '404' })
    }
  },
  provide() {
    const vm = this
    return {
      mark: vm.mark
    }
  },
  computed: {
    ...mapState('search', ['category', 'hashtag']),
    ...mapGetters('search', [
      'takeCurHashtag',
      'takeCurCategory',
      'selectedHashtagIdCollection'
    ])
  },
  watch: {
    '$store.state.search': {
      deep: true,
      handler(val) {
        if (val.groupId && !val.searchQuery) {
          this.$router.push(`?group_id=${val.groupId}`)
        } else if (!val.groupId && val.searchQuery) {
          this.$router.push(`?search=${val.searchQuery}`)
        } else if (val.groupId && val.searchQuery) {
          this.$router.push(
            `?group_id=${val.groupId}&search=${val.searchQuery}`
          )
        } else {
          this.$router.push('')
        }
      }
    },
    '$route.query': {
      deep: true,
      handler: debounce(async function(n, o) {
        if (n?.hashtag_id) {
          this.$root.globalModals.searchPreloader.showPreloader()

          this.$store.commit(
            'search/ADD_FILTER_HASHTAG_ID',
            this.takeCurHashtag({ hashtagId: +n?.hashtag_id })
          )

          this.$store.commit(
            'search/SET_HASHTAG_ID_BY_VALIDATE',
            this.selectedHashtagIdCollection
          )

          try {
            await Promise.all([
              /**
               * Fetch data content
               */
              this.$store.dispatch('search/FETCH_POST'),
              this.$store.dispatch('search/FETCH_COMMENT'),
              this.$store.dispatch('search/FETCH_GROUP_DATA'),
              this.$store.dispatch('search/FETCH_HASHTAG_DATA')
            ])
            this.mark()
          } catch (e) {
            console.error(e)
          } finally {
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
              this.$root.globalModals.searchPreloader.hidePreloader()
            }, 300)
          }
        } else if (n?.category_id) {
          this.$root.globalModals.searchPreloader.showPreloader()

          this.$store.commit('search/SET_CATEGORY_ID_BY_VALIDATE', [
            this.takeCurCategory({ categoryId: +n?.category_id })
          ])

          this.$store.commit(
            'search/ADD_FILTER_CATEGORY_ID',
            this.takeCurCategory({ categoryId: +n?.category_id })
          )

          try {
            await Promise.all([
              /**
               * Fetch data content
               */
              this.$store.dispatch('search/FETCH_POST'),
              this.$store.dispatch('search/FETCH_COMMENT'),
              this.$store.dispatch('search/FETCH_GROUP_DATA'),
              this.$store.dispatch('search/FETCH_HASHTAG_DATA')
            ])
            this.mark()
          } catch (e) {
            console.error(e)
          } finally {
            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
              this.$root.globalModals.searchPreloader.hidePreloader()
            }, 300)
          }
        }
      }, 300)
    }
  },
  mounted() {
    this.mark()
  },
  methods: {
    mark() {
      const vm = this
      const val = document.getElementById('searchField').value
      if (vm.mark_txt) {
        vm.mark_txt.unmark({
          done() {
            vm.mark_txt.mark(val)
          }
        })
      } else {
        vm.mark_txt = new Mark('.highlight-wrap')
        vm.mark_txt.mark(val)
      }
    }
  }
}
</script>
