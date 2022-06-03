<template>
  <div class="h-controls">
    <header-search v-if="$route.name !== 'search'" />
    <header-protect v-if="!loggedIn" />
    <header-profile v-if="loggedIn" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters('auth', ['loggedIn'])
  }
})
</script>

<style lang="scss" scoped>
@import 'header-controls';
</style>
