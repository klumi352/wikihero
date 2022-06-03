<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'HomeEdit',
  middleware: 'only-auth',
  validate({ redirect }) {
    redirect('/admin/pages/home')
    return true
  }
})
</script>

<style lang="scss"></style>
