<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <div class="wrapper">
      <h3 class="a-cblack">{{ $t('faker.title') }}</h3>
      <div class="inputs a-df a-jcsb">
        <v-input
          name="fake_votes.worked_for_me"
          type="number"
          :error="get(errors, 'fake_votes.worked_for_me')"
          :placeholder="$t('faker.worked')"
          :value="get(data, 'fake_votes.worked_for_me')"
          @input="(e) => $emit('input', e)"
        />
        <v-input
          name="fake_votes.not_worked"
          type="number"
          :error="get(errors, 'fake_votes.not_worked')"
          :placeholder="$t('faker.not-worked')"
          :value="get(data, 'fake_votes.not_worked')"
          @input="(e) => $emit('input', e)"
        />
        <v-input
          name="fake_votes.not_sure"
          type="number"
          :error="get(errors, 'fake_votes.not_sure')"
          :placeholder="$t('faker.not-sure')"
          :value="get(data, 'fake_votes.not_sure')"
          @input="(e) => $emit('input', e)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import get from 'lodash/get'

export default Vue.extend({
  props: {
    errors: Object,
    data: Object
  },
  methods: {
    get
  }
})
</script>

<style lang="scss" scoped>
@import 'admin-faker';
</style>
