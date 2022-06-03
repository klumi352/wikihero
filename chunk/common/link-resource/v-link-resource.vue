<template>
  <li class="v-resource">
    <a :href="it.url" class="link" target="_blank">
      <icon-fullscreen class="icon" width="18" height="18" />
      <div class="image-wrapper">
        <img
          width="128"
          height="128"
          :src="
            it.content.image
              ? it.content.image
              : $t('$i.empty-link-resource.url')
          "
          alt=""
        />
      </div>
      <div class="text-wrapper">
        <div class="g-h3 title">{{ it.content.title }}</div>
        <p class="description">{{ it.content.description }}</p>
      </div>
    </a>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    it: Object
  }
})
</script>

<style lang="scss" scoped>
/** using for embed tip */
@import '@/assets/scss/settings.scss';
/** common */
@import 'v-link-resource';
</style>
