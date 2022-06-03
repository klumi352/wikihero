<template>
  <modal-view
    key="comment-create-modal"
    ref="modal"
    v-slot="{ isOpen }"
    wide
    name="comment-create-modal"
    no-overflow
    @opened="opened = true"
    @closed="opened = false"
  >
    <div v-if="isOpen">
      <!-- Comment create popup -->
      <div class="create-comment-popup a-df">
        <!-- Left -->
        <div class="create-comment-popup__content a-df a-fdc">
          <h2 class="create-comment-popup__content-title a-ffr">
            {{ $t('modal-comment-create.title') }}
          </h2>
          <p class="create-comment-popup__content-subtitle a-ffr a-fz-12-14">
            {{ $t('modal-comment-create.subtitle') }}
          </p>
          <p class="create-comment-popup__content-content a-ffr">
            {{ $t('modal-comment-create.chapter_1') }}
          </p>
          <p
            class="create-comment-popup__content-content create-comment-popup__content-content--last a-ffr"
          >
            {{ $t('modal-comment-create.chapter_2') }}
          </p>
          <div class="create-comment-popup__btn-wrap a-df">
            <button
              class="g-btn create-comment-popup__close"
              @click="() => $refs.modal.close()"
            >
              {{ $t('global.close') }}
            </button>
            <nuxt-link
              class="g-btn g-btn--fill"
              :to="`/signup/?redirect=${$route.path}`"
            >
              {{ $t('modal.sign-up-message') }}
            </nuxt-link>
          </div>
        </div>
        <!--  -->

        <!-- Right -->
        <img
          class="create-comment-popup__pic"
          :src="$t('$i.success-non-logged.url')"
          alt=""
        />
        <!--  -->
      </div>
      <!--  -->
    </div>
  </modal-view>
</template>

<style lang="scss" scoped>
@import './comment-create.scss';
</style>

<script>
export default {
  data() {
    return {
      opened: false
    }
  }
}
</script>
