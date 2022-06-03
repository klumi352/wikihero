<template>
  <!-- eslint-disable vue/no-v-html -->
  <section v-once class="g-container container">
    <div class="wrapper">
      <div class="a-m-15-30 a-tal g-h3">{{ $t('home.info-title') }}</div>
      <div class="items">
        <div class="item">
          <div class="image-wrapper">
            <img
              width="295"
              height="220"
              :src="$t('$i.find-knowledge.url')"
              :alt="$t('$i.find-knowledge.alt')"
            />
          </div>
          <div class="intro">
            <h2>{{ fintContentInEditor(data, 0) }}</h2>
            <div class="g-cms">
              <ul>
                <li v-for="txt in fintContentInEditor(data, 1)" :key="txt">
                  {{ txt }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="image-wrapper">
            <img
              width="295"
              height="220"
              :src="$t('$i.search-result-knowledge.url')"
              :alt="$t('$i.search-result-knowledge.alt')"
            />
          </div>
          <div class="intro">
            <h2>{{ fintContentInEditor(data, 2) }}</h2>
            <div class="g-cms">
              <ul>
                <li v-for="txt in fintContentInEditor(data, 3)" :key="txt">
                  {{ txt }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-html="snippet"></div> -->
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import snippet from '@/__external/snippet'

export default Vue.extend({
  props: {
    data: Object
  },
  data() {
    return {
      snippet: snippet(10)
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'home-info';
</style>
