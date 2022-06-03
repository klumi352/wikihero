<template>
  <div class="wrapper">
    <!-- <button :title="$t('header.bell')" class="g-t-btn">
      <icon-bell width="16" height="16" />
    </button> -->

    <div class="a-dn">
      <div ref="menu-buttons" class="filter-buttons" @click="close">
        <nuxt-link v-if="isAdmin" to="/admin/topics" class="g-btn-drop">
          {{ $t('profile.btn-admin') }}
        </nuxt-link>
        <nuxt-link to="/profile" class="g-btn-drop">
          {{ $t('profile.btn-profile') }}
        </nuxt-link>
        <button class="g-btn-drop" @click="logout">
          {{ $t('profile.btn-logout') }}
        </button>
      </div>
    </div>
    <!-- profile -->
    <button ref="logo" :title="$t('header.profile')" class="g-t-btn logo">
      <div class="img-wrapper">
        <img width="36" height="36" :src="computeUserPhoto" />
      </div>
      <icon-arrow width="15" height="15" class="arrow" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState, mapMutations } from 'vuex'
import tippy from 'tippy.js'

export default Vue.extend({
  computed: {
    ...mapGetters('auth', ['isAdmin', 'tempUser']),
    ...mapState('auth', ['user', 'level']),
    takeAvatar() {
      return this.level?.profile?.avatar?.original_url
    },
    takeDefault() {
      return this.level?.points?.path_to_image
    },
    takeUserPhoto() {
      return this.level?.path_to_image
    },
    takeUserAvatar() {
      return this.user?.profile?.avatar?.original_url
    },
    computeUserPhoto() {
      return this.tempUser
        ? this.user?.author_avatar?.original_url
        : this.user?.author_avatar?.original_url
    }
  },
  mounted() {
    const vm = this
    const logo = vm.$refs.logo
    if (logo) {
      const tippyInstance: any = tippy(logo, {
        appendTo: () => document.body,
        offset: [0, 5],
        placement: 'bottom',
        animation: 'fade',
        trigger: 'click',
        zIndex: 100001,
        interactive: true,
        allowHTML: true,
        theme: 'drop'
      })
      tippyInstance.popper
        .querySelector('.tippy-content')
        .append(vm.$refs['menu-buttons'])

      vm.$on('close', () => {
        tippyInstance.hide()
      })

      vm.$once('hook:beforeDestroy', () => {
        tippyInstance.destroy()
      })
    }
  },
  methods: {
    ...mapMutations('group', ['TOOGLE_POINT_POPUP']),
    close() {
      this.$emit('close')
    },
    logout() {
      this.TOOGLE_POINT_POPUP(null)
      this.$store.dispatch('auth/logout')
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'header-profile';
</style>
