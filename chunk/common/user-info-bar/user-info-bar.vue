<template>
  <div class="user-bar a-df">
    <div class="user-bar__avatar-wrap a-df a-aic">
      <img :src="returnUserAvatar" alt="" class="user-bar__avatar" />
    </div>
    <div class="user-bar__info-wrap a-fg">
      <p class="user-bar__name a-ffr">{{ userInfo.author_name }}</p>
      <p class="user-bar__job-company a-ffr a-df a-fdc">
        <span v-if="userInfo.author_company">{{
          'Company: ' + userInfo.author_company
        }}</span>
        <span v-if="userInfo.author_job_title">{{
          'Job: ' + userInfo.author_job_title
        }}</span>
      </p>
      <p class="user-bar__created-data a-ffr">
        {{ 'Comment created: ' + userInfo.created_at }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'user-info-bar';
</style>

<script>
export default {
  props: {
    userInfo: Object
  },
  computed: {
    returnUserAvatar() {
      return this.userInfo?.author_avatar?.original_url
    }
  }
}
</script>
