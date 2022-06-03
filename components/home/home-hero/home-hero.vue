<template>
  <section class="g-container container g-aside-container home-hero">
    <div class="wrapper">
      <div class="a-cblack a-fz-18-20 a-ffr home-hero-title">
        {{ $t('home.hero-title') }}
      </div>
      <ul ref="hero_list" class="home-hero-list">
        <item v-for="(item, key) in items" :key="key" :item="item" />
      </ul>
      <div class="home-hero-btn">
        <nuxt-link to="/contributors" class="g-btn">{{
          $t('contributors.home-button')
        }}</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import Item from '@/components/contributors/item/item.vue'
export default {
  components: {
    Item
  },
  props: {
    data: Object
  },
  computed: {
    items() {
      const items = [...this.data.data]
      return items.splice(0, 6)
    }
  },
  localObserver() {
    return {
      collection: () => [...this.$refs.hero_list.children]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'home-hero';
</style>
