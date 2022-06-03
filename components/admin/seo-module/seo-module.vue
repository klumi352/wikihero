<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <div class="wrapper">
      <h3 class="a-cblack">{{ $t('admin.seo-title') }}</h3>
      <v-input
        name="meta_title"
        :error="errors.meta_title"
        :placeholder="$t('seo.title')"
        :value="data.meta_title"
        @input="(e) => $emit('input', e)"
        @keypress.enter="$emit('was-keypress')"
      />
      <v-textarea
        name="meta_description"
        :error="errors.meta_description"
        :placeholder="$t('seo.description')"
        :value="data.meta_description"
        @input="(e) => $emit('input', e)"
      />
      <v-textarea
        name="meta_keywords"
        :error="errors.meta_keywords"
        :value="data.meta_keywords"
        :placeholder="$t('seo.keywords')"
        @input="(e) => $emit('input', e)"
        @keypress.enter="$emit('was-keypress')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    errors: Object,
    data: Object
  }
})
</script>

<style lang="scss" scoped>
@import 'seo-module';
</style>
