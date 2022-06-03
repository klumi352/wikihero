<template>
  <div class="g-container">
    <div class="wrapper">
      <div v-if="error.statusCode === 404">
        <div class="a-mw600px">
          <h1>{{ $t('errors.404-title') }}</h1>
          <h3 class="a-cblack">{{ $t('errors.404-intro') }}</h3>
          <div class="g-h3 a-mt-30-60 a-mb-5">{{ $t('errors.404-input') }}</div>
          <home-search no-margin />
        </div>
        <img :src="$t(`$i.404-error.url`)" alt="" />
      </div>
      <div v-else>
        <div class="a-mw600px">
          <h1>{{ $t('errors.500-title') }}</h1>
          <h3 class="a-cblack">{{ $t('errors.500-intro') }}</h3>
          <div class="g-h3 a-mt-30-60 a-mb-5">{{ $t('errors.500-input') }}</div>
          <home-search no-margin />
        </div>
        <img :src="$t(`$i.500-error.url`)" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import HomeSearch from '@/components/home/home-search/home-search.vue'

export default {
  components: {
    HomeSearch
  },
  props: {
    error: Object
  },
  head() {
    return {
      bodyAttrs: { class: 'g-no-admin-controll' }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  padding: 150px 0;
}

img {
  max-width: 100%;
  @include fluid-size(margin-top, 20px, -150px);
}
</style>
