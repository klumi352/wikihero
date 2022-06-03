<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <div class="status-wrapper" :class="{ isLevelUp, noAnimation }">
      <div class="status-current">
        <img
          width="110"
          height="110"
          class="img"
          :src="level.path_to_image || user.points.points.level.path_to_image"
          alt=""
        />
      </div>

      <div class="status-main">
        <div class="g-h2">
          {{ $t('status.status') }}: {{ $t('status.level') }}
          <span class="level-count"
            ><span class="level-count-wrap">
              <span>{{
                level.level || user.points.points.level.level - 1
              }}</span
              ><span>{{
                level.level || user.points.points.level.level
              }}</span></span
            ></span
          >
        </div>
        <div class="status">
          <div
            v-if="initialPercent > 0"
            :class="{ animation }"
            class="bar bar--initial"
          ></div>
          <div :class="{ animation }" class="bar bar--new"></div>
        </div>
        <div
          v-html="
            `<style type='text/css'>
              [${$options._scopeId}] .bar.bar--initial {
                width: ${Math.max(Math.min(initialPercent, 95), 50)}%;
              }
              [${$options._scopeId}] .bar.bar--new {
                width: ${Math.max(computeWidth - initialPercent, 5)}%;
              }
            </style>`
          "
        ></div>
        <div class="g-h3 name">{{ MinLabel }} / {{ MaxLabel }}</div>
      </div>

      <div
        v-if="
          level.next_level_image || user.points.points.level.next_level_image
        "
        class="status-next"
      >
        <img
          width="40"
          height="40"
          class="img"
          :src="
            level.next_level_image || user.points.points.level.next_level_image
          "
          alt=""
        />
        <div class="g-h3 name">
          {{ $t('status.level') }}
          {{ level.level || user.points.points.level.level + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  props: {
    noAnimation: Boolean
  },
  data() {
    return {
      animation: true
    }
  },
  computed: {
    ...mapState('auth', ['level', 'user']),
    ...mapGetters('auth', ['isLevelUp']),
    initialPercent() {
      const L = this.level
      const O = this.level
      const count =
        ((O.total - L.point_from - L.count_points) /
          (L.point_to - L.point_from)) *
        100

      return count > 0 ? count : 0
    },
    computeWidth() {
      const L = this.level
      const O = this.level
      return (
        ((this.MinLabel - L.point_from) / (L.point_to - L.point_from)) * 100
      )
    },
    MinLabel() {
      return this.level.total || this.level.total_points || 0
    },
    MaxLabel() {
      return this.level.point_to || this.$t('profile.infinite-number')
    }
  },
  mounted() {
    setTimeout(() => (this.animation = false), 1000)
  }
})
</script>

<style lang="scss" scoped>
@import 'v-status';
</style>
