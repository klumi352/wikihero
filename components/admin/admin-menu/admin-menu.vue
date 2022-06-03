<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <div :class="{ expand }" class="wrapper">
      <button class="btn-expand g-t-btn" @click="expand = !expand">
        <span class="btn-expand__title">menu</span>
        <icon-expand width="20" height="20" />
      </button>
      <ul class="items">
        <li
          v-for="(item, i) in items"
          :key="i"
          :data-type="!item.concat ? 'button' : 'link'"
          :class="{ closed: !item.concat && item.closed }"
          class="item"
        >
          <button
            v-if="!item.length"
            class="btn g-btn-drop"
            @click="handleClick($event)"
          >
            {{ item.name }}
            <icon-arrow width="15" height="15" class="arrow" />
          </button>
          <ul v-else>
            <li v-for="j in item" :key="j.path">
              <a
                v-if="j.path.startsWith('http')"
                target="_blank"
                :href="j.path"
                class="link"
                @click="expand = false"
                v-html="j.name"
              ></a>
              <a
                is="nuxt-link"
                v-else
                :to="j.path"
                class="link"
                @click.native="expand = false"
                v-html="j.name"
              >
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Api } from '@/api.config'

export default Vue.extend({
  data() {
    return {
      expand: false,
      opt: null
    }
  },
  computed: {
    items() {
      const vm = this as any
      return [
        {
          name: `📙 ${vm.$t('global.page')}`,
          closed: true
        },
        [
          {
            path: '/admin/pages/home',
            name: vm.$t('global.home')
          },
          {
            path: '/admin/pages/code-of-conduct',
            name: vm.$t('footer.code-of-conduct')
          },
          {
            path: '/admin/pages/faq',
            name: vm.$t('footer.faq-page')
          },
          {
            path: '/admin/pages/about',
            name: vm.$t('footer.about-page')
          },
          {
            path: '/admin/pages/terms',
            name: vm.$t('footer.terms-page')
          },
          {
            path: '/admin/pages/privacy',
            name: vm.$t('footer.privacy-page')
          }
        ],
        {
          name: `📘 ${vm.$t('global.content')}`,
          closed: false
        },
        [
          {
            path: '/admin/topics',
            name: vm.$t('global.topics')
          },
          {
            path: '/admin/groups',
            name: vm.$t('global.groups')
          },
          {
            path: '/admin/categories',
            name: vm.$t('global.categories')
          },
          {
            path: '/admin/hashtags',
            name: vm.$t('global.hashtags')
          },
          {
            path: '/admin/posts',
            name: 'Posts'
          },
          {
            path: '/admin/seniority',
            name: vm.$t('global.levels')
          },
          {
            path: '/admin/comments',
            name: 'Comments'
          }
        ],
        {
          name: `🔔 ${vm.$t('global.notifs')}`,
          closed: false
        },
        [
          {
            path: '/admin/contributed-subtopics',
            name: `${vm.$t('global.subtopics')} ${vm.getCount('topics')}`
          },
          {
            path: '/admin/contributed-tips',
            name: `${vm.$t('global.tips')} ${vm.getCount('tips')}`
          },
          {
            path: '/admin/suggested-links',
            name: `${vm.$t('global.s-links')} ${vm.getCount('suggest_links')}`
          },
          {
            path: '/admin/moderator-requests',
            name: `${vm.$t('global.moder-reqs')} ${vm.getCount('moderators')}`
          },
          {
            path: '/admin/flaged-tips',
            name: `${vm.$t('global.flat-tips')} ${vm.getCount('flagged_tips')}`
          },
          {
            path: '/admin/looking-for',
            name: `${vm.$t('global.looking-for-req')} ${vm.getCount('offers')}`
          },
          {
            path: '/admin/tip-comments',
            name: `${vm.$t('global.tip-comments')} ${vm.getCount(
              'tip_comments'
            )}`
          },
          {
            path: '/admin/post-notification',
            name: `Posts ${vm.getCount('posts')}`
          },
          {
            path: '/admin/comment-notification',
            name: `Comments ${vm.getCount('comments')}`
          }
        ],
        {
          name: `📊 ${vm.$t('global.analitics')}`,
          closed: true
        },
        [
          {
            path: process.env.MATOMO_HOST,
            name: 'Matomo'
          },
          {
            path: '/admin/statistic',
            name: vm.$t('global.statistic')
          }
        ],
        {
          name: `⚙️ ${vm.$t('global.setts')}`,
          closed: true
        },
        [
          {
            path: '/admin/api',
            name: vm.$t('global.api')
          },
          {
            path: '/admin/users',
            name: vm.$t('global.users')
          },
          {
            path: '/admin/levels',
            name: vm.$t('global.levels')
          },
          {
            path: '/admin/images',
            name: vm.$t('global.images')
          },
          {
            path: '/admin/translations/?module=global',
            name: vm.$t('global.translations')
          }
        ]
      ]
    }
  },
  watch: {
    $route() {
      this.boot()
    }
  },
  mounted() {
    this.boot()
  },
  methods: {
    getCount(prop: any) {
      const count = this.opt?.[prop]
      return count ? `<i>${count}</i>` : ''
    },
    boot() {
      this.$axios(Api.admin.NOTIFICATIONS_ALL).then(({ data }) => {
        this.opt = data
      })
    },
    handleClick(e: any) {
      e.currentTarget.parentElement.classList.toggle('closed')
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'admin-menu.scss';
</style>
