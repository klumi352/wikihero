<template>
  <div>
    <layout-1>
      <template v-slot:default>
        <!-- eslint-disable vue/no-v-html -->
        <v-baner>
          <topic-breadcrumbs />
          <template slot="head">
            <h1>
              {{ topic.name }}
            </h1>
          </template>
        </v-baner>
        <!-- --- -->

        <ul>
          <SingleGroupItem
            v-for="(group, index) in group_data.data"
            :key="index"
            :it="group"
          >
          </SingleGroupItem>
        </ul>
        <!-- --- -->
      </template>
      <template v-slot:aside>
        <v-sharer />
      </template>
    </layout-1>

    <!-- @@@ modals -->
    <create-subtopic />
    <apply-moderator />
    <!-- --- -->
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState } from 'vuex'
import { headGenerator } from '@/helpers/headGenerator'
import { Api } from '@/api.config'
import { defaultFilter } from '@/store/topic'
// import TopicList from '@/components/topics/topic-list/topic-list.vue'
// import TopicNotfound from '@/components/topics/__modals/topic-notfound/topic-notfound.vue'
import TopicBreadcrumbs from '@/components/topics/topic-breadcrumbs/topic-breadcrumbs.vue'
import SingleGroupItem from '@/chunk/common/group/group-item.vue'
// @@@ modals
import CreateSubtopic from '@/components/topics/__modals/create-subtopic/create-subtopic.vue'
import ApplyModerator from '@/components/topics/__modals/apply-moderator/apply-moderator.vue'

export default Vue.extend({
  name: 'TopicPage',
  components: {
    // TopicList,
    // TopicNotfound,
    TopicBreadcrumbs,
    SingleGroupItem,
    // @@@ modals
    CreateSubtopic,
    ApplyModerator
  },
  async asyncData({ store, params, error, $axios }) {
    try {
      await store.dispatch('topic/find', { slug: params.topic })
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  data() {
    return {
      currSort: defaultFilter,
      loading: false,
      group_data: [],
      special_topic: 'experience-utilisateur-ux'
    }
  },
  computed: {
    ...mapState('topic', ['topic'])
  },
  async created() {
    await this.getGroupList(this.special_topic)
  },
  mounted() {
    this.$axios.delete(Api.client.CLEAR_TOPIC_NOTIFICATION(this.topic.id))
  },
  methods: {
    getWithFilter({ sort, page }: any): any {
      const vm = this
      vm.loading = true
      /* get last sort */ sort = sort || vm.currSort
      return vm.$store
        .dispatch('topic/getSubtopicInOveral', {
          slug: vm.$route.params.topic,
          sort,
          page
        })
        .then(() => {
          /* set last sort */
          vm.currSort = sort
        })
        .finally(() => {
          vm.loading = false
        })
    },
    async getGroupList(slug: string) {
      const vm = this as any
      const need_page = vm.$route.params.topic === slug
      if (need_page) {
        vm.group_data = await vm.$axios.get(Api.new.GET_ALL_GROUPS)
        return
      }
      vm.group_data = await vm.$axios.get(Api.new.GROUP_BY_TOPIC(this.topic.id))
    }
  },
  head() {
    return headGenerator(this.topic)
  },
  meta: {
    editable: true,
    createable: true,
    deleteable: true
  }
})
</script>
