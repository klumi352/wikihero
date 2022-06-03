<template>
  <!-- eslint-disable vue/no-v-html -->
  <transition name="fade" mode="out-in">
    <div v-if="computeShowModal" class="point" :class="{ isLevelUpMod }">
      <div class="point__progress-wrap">
        <span class="point__point-number a-ffr">{{
          `+ ${level.count_points} Pts`
        }}</span>
        <div class="status">
          <div
            v-if="initialPercent > 0"
            :class="{ animation }"
            class="bar bar--initial"
          ></div>
          <div :class="{ animation }" class="bar bar--new"></div>
        </div>
        <!--  -->
        <div
          v-html="
            `<style type='text/css'>
              [${$options._scopeId}] .bar.bar--initial {
                width: ${Math.max(Math.min(initialPercent, 95), 5)}%;
              }
              [${$options._scopeId}] .bar.bar--new {
                width: ${Math.max(computeWidth - initialPercent, 5)}%;
              }
            </style>`
          "
        ></div>
        <!--  -->
      </div>
      <p class="point__title a-ffr">{{ $t('modal-point.title') }}</p>
      <p class="point__description a-ffr">
        {{ $t('modal-point.description') }}
      </p>
      <div class="point__btn-wrap">
        <button
          class="point__btn g-btn"
          @click="
            $root.$emit('show-modal', {
              name: 'share-tip',
              data: post_created_data
            })
          "
        >
          <IconShareNew class="point__share-ico"></IconShareNew>
          {{ $t('global.share') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import 'point-modal';
</style>

<script lang="ts">
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      animation: true
    }
  },
  computed: {
    ...mapState('post', ['post_create', 'post_created_data']),
    ...mapState('auth', ['level']),
    ...mapState('group', ['logged_point_popup_id']),
    ...mapGetters('auth', ['isLevelUpMod']),
    initialPercent() {
      const count =
        ((this.level.total_points -
          this.level.point_from -
          this.level.count_points) /
          (this.level.point_to - this.level.point_from)) *
        100

      return count > 0 ? count : 0
    },
    computeWidth() {
      return (
        ((this.level.total_points - this.level.point_from) /
          (this.level.point_to - this.level.point_from)) *
        100
      )
    },
    computeShowModal() {
      return this.logged_point_popup_id === this.$route.params.group
    }
  },
  mounted() {
    setTimeout(() => (this.animation = false), 1000)
  }
})
</script>
