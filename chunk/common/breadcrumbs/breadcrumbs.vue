<template>
  <!-- eslint-disable vue/no-v-html  -->
  <div>
    <div class="breadcrumbs">
      <nuxt-link class="root-btn g-link" :to="fromLink"
        >{{ fromName }}&nbsp;</nuxt-link
      >
      <span v-html="' > '"></span>
      <span disabled class="current">&nbsp;{{ toName }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'breadcrumbs';
</style>

<script>
export default {
  props: {
    fromLink: {
      type: String,
      default: '/'
    },
    fromName: {
      type: String,
      default() {
        return this.$t('global.home')
      }
    },
    toName: {
      type: String,
      required: true
    }
  }
}
</script>
