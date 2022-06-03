<template>
  <ul class="footer-social">
    <li class="item">
      <a target="_blank" class="link g-t-btn" :href="$t('footer.linkedin-link')"
        ><icon-linkedin width="24" height="24" />
      </a>
    </li>
    <li class="item">
      <a target="_blank" class="link g-t-btn" :href="$t('footer.facebook-link')"
        ><icon-facebook width="24" height="24" />
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  localObserver() {
    return {
      single: () => this.$el
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'footer-social';
</style>
