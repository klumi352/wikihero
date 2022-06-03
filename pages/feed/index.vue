<template>
  <div>
    <layout-3>
      <transition name="fade" mode="out-in">
        <feed-onboarding v-if="isOnboard" @close="closeBoard" />
      </transition>

      <breadcrumbs :to-name="breadcrumbTitle" />

      <feed-header @update-sort="handleUpdateSort" @validate="handleValidate" />

      <feed-result :sort="sort" />

      <validating-tip />
      <CommentCreate />
    </layout-3>
  </div>
</template>

<script>
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable require-await */
import { mapGetters, mapMutations, mapState } from 'vuex'
import { Api } from '~/api.config'
import { mt } from '@/store/auth'
import FeedHeader from '@/components/feed/feed-header/feed-header'
import FeedResult from '@/components/feed/feed-result/feed-result'
import FeedOnboarding from '@/components/feed/feed-onboarding/feed-onboarding'
import ValidatingTip from '@/components/topics/__modals/validating-tip/validating-tip.vue'
import CommentCreate from '@/components/topics/__modals/comment-create/comment-create.vue'

export default {
  loading: true,
  components: {
    FeedHeader,
    FeedResult,
    FeedOnboarding,
    ValidatingTip,
    CommentCreate
  },
  async asyncData({ store }) {
    try {
      await store.dispatch('feed/FETCH_POST')
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  data() {
    return {
      filters: {},
      sort: 'recent',
      isOnboard: false
    }
  },
  computed: {
    ...mapState('feed', ['posts']),
    ...mapGetters('filter', ['getCategsId', 'getHashtagsId']),
    ...mapState('filter', ['categories', 'hashtags']),
    ...mapGetters('auth', ['loggedIn']),
    breadcrumbTitle() {
      return 'Activité récente'
    }
  },
  mounted() {
    this.$nextTick(() => {
      const appHeight = () => {
        const doc = document.querySelector('.like-feed-filter')
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
      }
      window.addEventListener('resize', appHeight)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', appHeight)
      })
      appHeight()
    })
    this.lastVisitPage()
    this.checkOnboard()
  },
  destroyed() {
    this.$store.commit('filter/SET_INITIAL_STATE')
  },
  methods: {
    /* Fetch feed page data */
    async handleUpdateSort(sort) {
      this.sort = sort
      try {
        this.$root.$showPreloader()
        await this.$store.dispatch('feed/FETCH_POST', {
          sort_by: sort,
          categ_id: this.getCategsId,
          has_id: this.getHashtagsId
        })
      } catch (e) {
        throw e
      } finally {
        this.$root.$hidePreloader()
      }
    },
    async handleValidate() {
      try {
        this.$root.$showPreloader()
        await this.$store.dispatch('feed/FETCH_POST', {
          sort_by: this.sort,
          categ_id: this.getCategsId,
          has_id: this.getHashtagsId
        })
      } catch (e) {
        throw e
      } finally {
        this.$root.$hidePreloader()
      }
    },
    /* --- */

    /* Feed signup popup logic */
    closeBoard() {
      localStorage.removeItem('onboard')
      localStorage.removeItem('onboardEmail')
      this.checkOnboard()
    },
    checkOnboard() {
      const ls = localStorage
      const items = ls.getItem('onboard') && JSON.parse(ls.getItem('onboard'))
      if (
        ls.getItem('onboardEmail') &&
        ls.getItem('onboardEmail') !== this.$store.state.auth.user.email
      ) {
        this.isOnboard = false
        return
      }
      if (
        ls.getItem('onboard') &&
        Object.values(items).length < 3 &&
        !Object.values(items).some((i) => !i)
      ) {
        ls.setItem('onboardEmail', this.$store.state.auth.user.email)
        this.isOnboard = true
      } else if (
        ls.getItem('onboard') &&
        Object.values(items).length > 2 &&
        Object.values(items).every((i) => i)
      ) {
        this.isOnboard = true
        setTimeout(() => {
          this.isOnboard = false
          ls.removeItem('onboard')
          ls.removeItem('onboardEmail')
        }, 2000)
      } else {
        this.isOnboard = false
      }
    },
    /* --- */

    lastVisitPage() {
      setTimeout(() => {
        if (this.$store.getters['auth/loggedIn']) {
          this.$axios.get(Api.client.LAST_VISIT_DATE)
          this.$store.commit(`auth/${mt.MISSED_POSTS}`, 0)
        }
      }, 10000)
    }
  }
}
</script>
