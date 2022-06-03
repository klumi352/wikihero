<template>
  <div class="a-dn"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { getUserId } from '@/store/auth'

export default Vue.extend({
  computed: {
    ...mapState('auth', ['user'])
  },
  mounted() {
    const vm = this
    vm.$watch('user', () => {
      vm.trackUserId()
    })
  },
  methods: {
    trackUserId() {
      if (this.user) {
        this.$analytic('setUserId', getUserId(this.user))
      }
    }
  }
})
</script>
