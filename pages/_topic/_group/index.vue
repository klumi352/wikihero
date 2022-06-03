<template>
  <div>
    <layout-3>
      <template v-slot:default>
        <!-- eslint-disable vue/no-v-html -->
        <v-baner>
          <nuxt-link
            class="g-link a-mb-20 mobile-back"
            :to="`/${group_data.topic.slug}`"
          >
            <icon-arrow />
            {{ group_data.topic.name }}
          </nuxt-link>
          <breadcrumbs
            class="mobile-breadcrumbs"
            :to-name="group_data.title"
            :from-name="group_data.topic.name"
            :from-link="`/${group_data.topic.slug}`"
          />
          <GroupBaner class="group-baner"></GroupBaner>
          <GroupSharer class="group-sharer" :group_page="group_page" />
        </v-baner>
        <GroupTabs @sort="sortPosts"></GroupTabs>
        <ul ref="post_list" class="post__list a-df a-fdc">
          <PostItem
            v-for="post in list.data"
            v-show="list.data.length"
            :key="post.id"
            :post="post"
            force-open
          ></PostItem>
          <div v-show="!list.data.length" class="post__list__noResult">
            <span>{{ $t('search.no-data') }}</span>
          </div>
        </ul>
        <v-pagination
          class="buttons a-df a-jcc"
          :meta="list.meta"
          :loading="loading"
          @change="pagination"
        />
      </template>
      <template v-slot:aside>
        <GroupSharer :group_page="group_page" />
        <!-- @@@ modals -->
        <PointModal></PointModal>
        <!-- --- -->
      </template>
    </layout-3>
    <!-- @@@ modals -->
    <flag-tip />
    <share-tip />
    <validating-tip />
    <apply-moderator />
    <GroupFilter />
    <CommentCreate />
    <!-- --- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import Vue from 'vue'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { headGenerator } from '@/helpers/headGenerator'
import GroupSharer from '@/components/group/group-sharer/group-sharer.vue'
import TopicBreadcrumbs from '@/components/topics/topic-breadcrumbs/topic-breadcrumbs.vue'
import GroupBaner from '@/components/group/group-baner/group-baner.vue'
import PostItem from '@/components/common/post-component/post-item.vue'
import GroupTabs from '@/components/group/group-tabs/group-tabs.vue'
import { Api } from '@/api.config'
// @@@ modals
import ApplyModerator from '@/components/topics/__modals/apply-moderator/apply-moderator.vue'
import FlagTip from '@/components/topics/__modals/flag-tip/flag-tip.vue'
import ShareTip from '@/components/topics/__modals/share-tip/share-tip.vue'
import ValidatingTip from '@/components/topics/__modals/validating-tip/validating-tip.vue'
import GroupFilter from '@/components/topics/__modals/filter/filter.vue'
import PointModal from '@/components/post/__modals/point-modal/point-modal.vue'
import CommentCreate from '@/components/topics/__modals/comment-create/comment-create.vue'
export default Vue.extend({
  components: {
    GroupSharer,
    GroupBaner,
    PostItem,
    GroupTabs,
    ApplyModerator,
    FlagTip,
    ShareTip,
    ValidatingTip,
    GroupFilter,
    PointModal,
    CommentCreate
  },
  // eslint-disable-next-line require-await
  async asyncData({ params, error, store }) {
    try {
      const data = await store.dispatch('group/SET_GROUP_PAGE', {
        group_slug: params.group
      })
      return {
        group_data: data
      }
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  beforeRouteUpdate(to, from, next) {
    const vm = this as any
    if (from.params.group === vm.logged_point_popup_id) {
      vm.TOOGLE_POINT_POPUP(null)
    }
    next()
  },
  data() {
    return {
      loading: false
    }
  },
  created() {
    const vm = this as any
    vm.POST_CREATE_INITIAL()
  },
  computed: {
    ...mapState('group', ['group_page', 'logged_point_popup_id']),
    ...mapState('post', ['list']),
    ...mapState('filter', [
      'selected_hashtags',
      'selected_categories',
      'sort_type'
    ]),
    ...mapGetters('filter', ['getHashtagsId', 'getCategsId']),
    ...mapState('auth', ['level'])
  },
  mounted() {
    const vm = this as any
    vm.specialHandler()
    /* - set vuex store variable while create a post in aside navigation
     * - show small modal on group page
     * - use setTimeout to wait untill page will load
     * - use window.onload event to clear vuex store after refresh the page */
    setTimeout(() => {
      window.onunload = function() {
        vm.TOOGLE_POINT_POPUP(null)
      }
    }, 3000)
    /* --- */
  },
  destroyed() {
    this.$store.commit('filter/SET_INITIAL_STATE')
  },
  methods: {
    specialHandler() {
      if (this.$route.query && this.$route.query.special) {
        const items =
          localStorage.getItem('onboard') &&
          JSON.parse(localStorage.getItem('onboard'))
        if (items) {
          localStorage.setItem(
            'onboard',
            JSON.stringify({ ...items, special: true })
          )
        } else {
          localStorage.setItem('onboard', JSON.stringify({ special: true }))
        }
      }
    },
    async sortPosts(v: string) {
      const vm = this as any
      vm.$root.$showPreloader()
      vm.SET_SORT_TYPE(v)
      await vm.$store.dispatch('post/GET_POSTS_LIST', {
        order_by: v,
        id: vm.group_data?.id,
        categ_id: vm.getCategsId,
        hashtag_id: vm.getHashtagsId
      })
      vm.$root.$hidePreloader()
    },
    ...mapMutations('post', ['HANDLE_FORM_INPUT', 'POST_CREATE_INITIAL']),
    ...mapMutations('filter', ['SET_SORT_TYPE']),
    ...mapMutations('group', ['TOOGLE_POINT_POPUP']),
    async pagination({ page }: any) {
      const vm = this
      try {
        vm.loading = true
        await vm.$store.dispatch('post/GET_POSTS_LIST', {
          page,
          id: vm.group_data?.id,
          categ_id: vm.getCategsId,
          hashtag_id: vm.getHashtagsId,
          order_by: vm.sort_type
        })
      } catch (e) {
        throw e
      } finally {
        vm.loading = false
      }
    }
  },
  localObserver() {
    return {
      collection: () => [...this.$refs.post_list.children]
    }
  },
  head() {
    return headGenerator({
      name: this.group_data.title,
      description: this.group_data.description,
      image: this.group_data.logo.original_url
    })
  },
  meta: {
    editable: true,
    createable: true,
    deleteable: true
  }
})
</script>

<style lang="scss" scoped>
.mobile-back {
  display: none;

  ::v-deep {
    svg {
      transform: rotate(90deg);
      margin-top: 5px;
      margin-right: 10px;

      path {
        fill: var(--c-brand);
      }
    }
  }

  @include media-to(xs) {
    display: inline-flex;
    align-items: center;
  }
}

.mobile-breadcrumbs {
  display: block;

  @include media-to(xs) {
    display: none;
  }
}

.group-baner {
  ::v-deep {
    .baner__main-wrap {
      @include media-to(lg) {
        margin-bottom: 35px;
      }
    }
  }
}

.group-sharer {
  display: none;
  margin-bottom: 55px;
  margin-top: 0;

  @include media-to(lg-mid) {
    display: block;
  }
}
.post__list__noResult {
  margin-top: 10px;
  text-align: center;
}
</style>
