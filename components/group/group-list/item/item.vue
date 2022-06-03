<template>
  <li class="group-item">
    <div class="group-item__media">
      <img :src="item.logo.original_url" :alt="item.title" />
    </div>
    <div class="group-item__content">
      <nuxt-link
        class="content-title highlight-wrap"
        :to="item.computed_slug"
        v-html="processedTitle"
      ></nuxt-link>
      <p
        class="content-desc g-p highlight-wrap"
        v-html="processedDescription"
      />
      <div class="content-members">
        <div class="content-members-person-wrap">
          <div
            v-for="({ profile, name }, index) in item.subscribers"
            :key="index"
            class="person"
          >
            <img
              :src="profile ? profile.avatar.original_url : ''"
              :alt="name"
            />
          </div>
        </div>
        <div class="content-members-txt">
          {{ item.subscribers_count }} {{ $t('group.members') }}
        </div>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
@import 'item';
</style>

<script>
import { SearchResultItemMixin } from '~/plugins/vue-extend/mixins/-search-result-item-mixin'

export default SearchResultItemMixin().extend({
  props: {
    item: Object
  },
  computed: {
    processedTitle() {
      return this.item.title
    },
    processedDescription() {
      return this.item.description
    }
  }
})
</script>
