<template>
  <li class="hero-item">
    <div class="hero-item-media">
      <img :src="item.profile.avatar.original_url" alt="" />
    </div>
    <div class="hero-item-content">
      <div
        class="hero-item-name a-cblack a-ffr"
        :title="`${item.profile.first_name} ${item.profile.last_name}`"
      >
        {{ item.profile.first_name }} {{ item.profile.last_name }}
      </div>
      <div class="hero-item-position a-ffr">
        {{ item.profile.job_title }}
        <span v-if="item.profile.company">&#64;{{ item.profile.company }}</span>
      </div>
      <div class="hero-item-achieve a-cblack a-ffr">
        {{ $t('contributors.people-helped-icon') }}
        {{ item.people_helped_count }}
        {{ $t('contributors.people-helped-txt') }}
      </div>
      <div class="hero-item-progress a-cblack a-ffr">
        {{ $t('contributors.contributions-count-icon') }}
        {{ item.contributions_count }}
        {{ $t('contributors.contributions-count-txt') }}
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ['item']
}
</script>

<style lang="scss" scoped>
@import 'item';
</style>
