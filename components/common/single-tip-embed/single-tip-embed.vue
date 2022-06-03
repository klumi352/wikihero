<template>
  <a
    ref="descr"
    target="_blank"
    :href="`${siteUrl}/tip/${it.id}`"
    class="wikihero-tip"
  >
    <div class="wikihero-wrapper">
      <div class="wikihero-title">{{ it.name }}</div>
      <div class="wikihero-votes">
        <!-- LIMIT -->
        <span v-if="!underLimit" class="wikihero-useful"
          >{{ it.average_worked }}% {{ $t('tip.found-useful') }}</span
        >
        <span v-else class="wikihero-useful">{{ $t('tip.no-enough') }}</span>

        <!-- VOTES -->
        <span> - {{ $t('tip.be-first') }}</span>
      </div>
      <div class="wikihero-intro">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="it.description"></div>
      </div>
      <div class="wikihero-rates">
        <div class="wikihero-rates-wrap">
          <div class="wikihero-rates-item">
            <span class="wikihero-btn-2">
              💪&nbsp;{{ $t(`tip.opt-1-${Number(!!it.is_worked)}`) }}
            </span>
            <div class="wikihero-rates-count">
              {{ computeCount('worked') }} {{ $t('tip.votes') }}
            </div>
          </div>
          <div class="wikihero-rates-item">
            <span class="wikihero-btn-2">
              😭&nbsp;{{ $t(`tip.opt-2-${Number(!!it.is_worked)}`) }}
            </span>
            <div class="wikihero-rates-count">
              {{ computeCount('not_worked') }} {{ $t('tip.votes') }}
            </div>
          </div>
          <div class="wikihero-rates-item">
            <span class="wikihero-btn-2">
              🤔&nbsp;{{ $t(`tip.opt-3-${Number(!!it.is_worked)}`) }}
            </span>
            <div class="wikihero-rates-count">
              {{ computeCount('not_sure') }} {{ $t('tip.votes') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="it.suggested_links && it.suggested_links.length"
        class="wikihero-resources"
      >
        <div>{{ $t('tip.resources') }}</div>
        <ul>
          <v-link-resource
            v-for="r in it.suggested_links"
            :key="r.url"
            :it="r"
          />
        </ul>
      </div>
      <div class="wikihero-buttons">
        <div>
          <span class="wikihero-btn">
            <icon-plus /> {{ $t('tip.suggest') }}
          </span>
        </div>
      </div>
      <!-- --- -->
      <div class="wikihero-buttons">
        <span class="wikihero-btn">
          <icon-flag width="22" height="22" />&nbsp;{{ $t('tip.flag') }}
        </span>
        <span class="wikihero-btn">
          <icon-share width="22" height="22" />&nbsp;{{ $t('tip.share') }}
        </span>
      </div>
    </div>
  </a>
</template>

<script>
import Vue from 'vue'
import VLinkResource from '@/chunk/common/link-resource/v-link-resource.vue'
import IconShare from '@/chunk/__svg/icon-share.svgm'
import IconPlus from '@/chunk/__svg/icon-plus.svgm'
import IconFlag from '@/chunk/__svg/icon-flag.svgm'

export default Vue.extend({
  components: {
    VLinkResource,
    IconShare,
    IconPlus,
    IconFlag
  },
  props: {
    it: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      siteUrl: 'https://www.wikihero.org',
      limitTipPercent: 10
    }
  },
  computed: {
    underLimit() {
      return this.limitTipPercent > this.it.count_voted
    }
  },
  methods: {
    computeCount(type) {
      const vm = this
      const cw = vm.it[`count_${type}`]
      return cw
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'single-tip-embed.scss';
</style>
