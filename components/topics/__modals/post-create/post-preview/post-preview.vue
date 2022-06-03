<template>
  <div>
    <div class="post">
      <div class="post__wrap">
        <div class="post__top-wrap">
          <div class="post__avatar-wrap">
            <img
              :src="
                loggedIn && !form.is_anonymous
                  ? user.profile.avatar.original_url
                  : require('@/static/avatar.png')
              "
              alt=""
              class="post__avatar"
              :class="{ anonymous: form.is_anonymous }"
            />
          </div>

          <div class="post__title a-ffb">
            {{ form.title }}
          </div>

          <div class="post__nav-wrap">
            <ul>
              <li>
                <nuxt-link class="post__link post__link--group a-ffr" to="#">{{
                  takeGroupNameById
                }}</nuxt-link>
              </li>
              <li>
                <nuxt-link
                  class="post__link post__link--category a-ffr"
                  to="#"
                  >{{ takeCategoryNameById }}</nuxt-link
                >
              </li>
              <li v-for="(hashtag, index) in form.hashtags" :key="index">
                <nuxt-link class="post__link a-ffr" to="#">{{
                  hashtag
                }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="post__content-wrap">
          <div
            class="post__preview-txt a-fz-18-20"
            v-html="form.description"
          ></div>
        </div>
      </div>
    </div>
    <div class="a-df a-jcc">
      <div class="a-df a-jcsb post__btns">
        <button class="g-btn" @click="$emit('switch', 'post-form')">
          {{ $t('modal-post-create.edit') }}
        </button>
        <button class="g-btn g-btn--fill" @click="post">
          {{ $t('modal-post-create.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'post-preview';
</style>

<script lang="ts">
/* eslint-disable vue/no-v-html */
/* eslint-disable vue/order-in-components */
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'
export default Vue.extend({
  props: {
    data: {
      type: Object
    },
    userInfo: {
      type: Object
    }
  },
  computed: {
    ...mapState('post', ['form']),
    ...mapGetters('post-create', ['getNoSub', 'getSub', 'getCateg']),
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['loggedIn']),
    takeGroupNameById() {
      const vm = this as any
      return [...vm.getNoSub, ...vm.getSub].find(
        (i: any) => i.id === vm.form.group_id
      )?.title
    },
    takeCategoryNameById() {
      const vm = this as any
      return vm.getCateg.find((i: any) => i.id === vm.form.category_id)?.title
    }
  },
  methods: {
    post() {
      const vm = this as any
      vm.$emit('post')
    }
  }
})
</script>
