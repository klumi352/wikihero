<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="point" :class="{ isLevelUpMod }">
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
    <p class="point__title a-ffr">{{ $t('post.post-point') }}</p>
  </div>
</template>

<style lang="scss" scoped>
@import 'point-post';
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
    ...mapState('auth', ['level']),
    ...mapGetters('auth', ['isLevelUpMod']),
    initialPercent() {
      const total = this.level.pointOperation
        ? this.level.pointOperation.total
        : this.level.total
      const count =
        ((total - this.level.point_from - this.level.count_points) /
          (this.level.point_to - this.level.point_from)) *
        100

      return count > 0 ? count : 0
    },
    computeWidth() {
      const total = this.level.pointOperation
        ? this.level.pointOperation.total
        : this.level.total
      return (
        ((total - this.level.point_from) /
          (this.level.point_to - this.level.point_from)) *
        100
      )
    }
  },
  mounted() {
    setTimeout(() => (this.animation = false), 1000)
  }
})
</script>
