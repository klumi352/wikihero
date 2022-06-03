<template>
  <section class="g-container g-aside-container container home-power">
    <div class="wrapper">
      <div class="a-cblack a-fz-18-20 a-ffr home-power-title">
        {{ $t('home.power-title') }}
      </div>
      <div class="home-power-content">
        <div class="home-power-media">
          <div class="lottie-img" :class="{ faded }">
            <div ref="lottie" class="lottie-fire"></div>
          </div>
        </div>
        <div ref="tabs" class="home-power-tabs">
          <tab
            v-for="(item, index) in _chunkData(data)"
            :key="index"
            :item="item"
            :active-tab="activeTab"
            :index="index"
            @close-all="activeTab = $event"
          >
            <template v-slot:first>
              <nuxt-link to="/feed" class="g-btn">
                {{ $t('home.tab-1') }}
              </nuxt-link>
            </template>
            <template v-slot:second>
              <nuxt-link :to="'/feed?special=true'" class="g-btn">
                {{ $t('home.tab-2') }}
              </nuxt-link>
            </template>
            <template v-slot:third>
              <button
                class="g-btn"
                @click="() => $root.globalModals.createPost.open()"
              >
                {{ $t('home.tab-3') }}
              </button>
            </template>
            <template v-slot:fourth>
              <nuxt-link to="/about-us" class="g-btn">
                {{ $t('home.tab-4') }}
              </nuxt-link>
            </template>
          </tab>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import lottie from 'lottie-web'
import Tab from './tab/tab.vue'
import { EditorMixins } from '@/plugins/vue-extend/mixins/-editor-minins'
export default EditorMixins().extend({
  props: {
    data: Object
  },
  components: {
    Tab
  },
  data: () => ({
    activeTab: 0,
    faded: false
  }),
  watch: {
    activeTab() {
      this.faded = false
      setTimeout(() => {
        lottie.destroy()
        this.lottieRender()
      }, 300)
    }
  },
  methods: {
    lottieRender() {
      setTimeout(() => {
        this.faded = true
      }, 300)
      const elem = this.$refs.lottie
      lottie.loadAnimation({
        wrapper: elem,
        animType: 'svg',
        loop: true,
        path: `/lottie/home-animation-${this.activeTab + 1}.json`
      })
    }
  },
  localObserver() {
    return {
      collection: () => [...this.$refs.tabs.children]
    }
  },
  mounted() {
    this.lottieRender()
  }
})
</script>

<style lang="scss" scoped>
@import 'home-power';
</style>
