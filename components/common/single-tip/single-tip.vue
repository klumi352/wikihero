<template>
  <div ref="descr" class="subtopic-tip">
    <div>
      <div class="title g-h2">{{ it.name }}</div>
      <div class="votes g-h3">
        <!-- LIMIT -->
        <span v-if="!underLimit" class="useful"
          >{{ it.average_worked }}% {{ $t('tip.found-useful') }}</span
        >
        <span v-else class="useful">{{ $t('tip.no-enough') }}</span>

        <!-- VOTES -->
        <span v-if="isVotes">
          -
          {{
            (checkVote ? it.count_voted + 1 : it.count_voted)
              | pluralize($t('tip.votes'), $t('tip.votes-plu'))
          }}
        </span>
        <span v-else> - {{ $t('tip.be-first') }}</span>

        &nbsp;<nuxt-link
          v-if="isAdmin && $route.name !== 'tip-id'"
          :to="`/tip/${it.id}`"
          class="g-t-btn g-t-btn--svg-brand"
        >
          <icon-link width="15" height="15" />
        </nuxt-link>
      </div>
      <div class="intro g-cms">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="it.description"></div>
      </div>
      <div class="rates">
        <div class="rates-wrap">
          <div class="rates-item">
            <fetch-loading :class="{ loading: load1 }"
              ><button
                :disabled="load1 || load2 || load3"
                class="btn"
                :class="{ active: typeVote === 'worked' }"
                @click="toValidation(1)"
              >
                💪&nbsp;{{ Number(!!it.is_worked) }}
              </button>
            </fetch-loading>
            <div class="g-h4 rates-count">
              {{
                computeCount('worked')
                  | pluralize($t('tip.votes'), $t('tip.votes-plu'))
              }}
            </div>
          </div>
          <div class="rates-item">
            <fetch-loading :class="{ loading: load2 }">
              <button
                :disabled="load1 || load2 || load3"
                class="btn"
                :class="{ active: typeVote === 'not_worked' }"
                @click="toValidation(2)"
              >
                😭&nbsp;{{ $t(`tip.opt-2-${Number(!!it.is_worked)}`) }}
              </button>
            </fetch-loading>
            <div class="g-h4 rates-count">
              {{
                computeCount('not_worked')
                  | pluralize($t('tip.votes'), $t('tip.votes-plu'))
              }}
            </div>
          </div>
          <div class="rates-item">
            <fetch-loading :class="{ loading: load3 }">
              <button
                :disabled="load1 || load2 || load3"
                class="btn"
                :class="{ active: typeVote === 'not_sure' }"
                @click="toValidation(3)"
              >
                🤔&nbsp;{{ $t(`tip.opt-3-${Number(!!it.is_worked)}`) }}
              </button>
            </fetch-loading>
            <div class="g-h4 rates-count">
              {{
                computeCount('not_sure')
                  | pluralize($t('tip.votes'), $t('tip.votes-plu'))
              }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="it.suggested_links && it.suggested_links.length"
        class="resources"
      >
        <h3 :class="forceOpen ? '' : '_a-cwhite'">{{ $t('tip.resources') }}</h3>
        <ul>
          <v-link-resource
            v-for="r in it.suggested_links"
            :key="r.url"
            :it="r"
          />
        </ul>
      </div>
      <div>
        <button
          class="suggest g-btn "
          :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
          @click="
            $root.$emit('show-modal', { name: 'suggest-a-link', data: it.id })
          "
        >
          <icon-plus /> {{ $t('tip.suggest') }}
        </button>
      </div>
      <!-- --- -->
      <div class="menu-buttons">
        <button
          class="g-btn"
          :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
          @click="$root.$emit('show-modal', { name: 'flag-tip', data: it.id })"
        >
          <icon-flag width="22" height="22" />&nbsp;{{ $t('tip.flag') }}
        </button>
        <button
          class="g-btn"
          :class="forceOpen ? 'g-btn--link' : 'g-btn--link'"
          @click="$root.$emit('show-modal', { name: 'share-tip', data: it })"
        >
          <icon-share width="22" height="22" />&nbsp;{{ $t('tip.share') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SingleTip from './single-tip.js'
export default SingleTip
</script>

<style lang="scss" scoped>
@import '@/assets/scss/settings.scss';
@import 'single-tip';
</style>
