<template>
  <div>
    <div class="wrapper">
      <div class="col">
        <div class="g-h2">{{ data.settings.count_posts || 0 }}</div>
        <div class="title g-h3 a-mb-15">
          {{
            data.settings.count_posts
              | pluralize(
                $t('profile.contribution'),
                $t('profile.contribution-plu'),
                false
              )
          }}
        </div>
      </div>
      <div class="col">
        <div class="g-h2">{{ data.settings.count_worked_reaction || 0 }}</div>
        <div class="title g-h3 a-mb-15">
          {{
            data.settings.count_worked_reaction
              | pluralize($t('profile.help'), $t('profile.help-plu'), false)
          }}
        </div>
      </div>
      <div class="col">
        <div class="g-h2">{{ data.settings.count_posts_viewes || 0 }}</div>
        <div class="title g-h3 a-mb-15">
          {{
            data.settings.count_posts_viewes
              | pluralize($t('profile.view'), $t('profile.view-plu'), false)
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState('profile', ['data'])
  }
})
</script>

<style lang="scss" scoped>
@import 'admin-info';
</style>
