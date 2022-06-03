<template>
  <div>
    <layout-2>
      <template v-slot:default>
        <div>
          <nuxt-child />
        </div>
      </template>
      <template v-slot:aside>
        <admin-menu />
      </template>
    </layout-2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AdminMenu from '@/components/admin/admin-menu/admin-menu.vue'
export default Vue.extend({
  name: 'AdminIndex',
  middleware: 'only-admin',
  components: {
    AdminMenu
  }
})
</script>

<style lang="scss"></style>
