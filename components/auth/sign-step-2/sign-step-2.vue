<template>
  <div class="form form-info a-pr">
    <div class="a-pa step-pag a-ffr">
      {{ `${$parent.step}/3` }}
    </div>
    <h3 class="form-title a-cblack a-ffm a-mb-10-20">
      {{ titleUserReplace() }}
    </h3>
    <div class="g-h3 a-cblack pdr-40">
      {{ $t('sign.step-2-desc') }}
    </div>
    <div class="accordion-content a-mt-60-100">
      <h3 class="accordion-content-title form-title  a-cblack a-ffm">
        {{ $t('sign.accordion-title') }}
      </h3>
      <expand-item
        v-for="(item, key) in tabs"
        :key="key"
        :idx="key + 1"
        :active="activeTab"
        :item="item"
        @open="activeTab = $event"
      />
    </div>
    <div class="a-df a-jcsb a-mt-30-60">
      <button class="g-btn" @click="$emit('changeIndex', 1)">
        {{ $t('sign.previous') }}
      </button>
      <button class="g-btn g-btn--fill" @click="$emit('changeIndex', 3)">
        {{ $t('sign.continue') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import expandItem from '@/components/auth/sign-step-2/expand-item/expand-item'

export default {
  components: {
    expandItem
  },
  data: () => ({
    activeTab: 0,
    tabs: []
  }),
  created() {
    this.tabs = [
      {
        title: this.$t('sign.expand-1-title'),
        desc: this.$t('sign.expand-1-desc')
      },
      {
        title: this.$t('sign.expand-2-title'),
        desc: this.$t('sign.expand-2-desc')
      },
      {
        title: this.$t('sign.expand-3-title'),
        desc: this.$t('sign.expand-3-desc')
      },
      {
        title: this.$t('sign.expand-4-title'),
        desc: this.$t('sign.expand-4-desc')
      }
    ]
  },
  computed: {
    ...mapState('auth', {
      userStore: (s) => s.form
    })
  },
  methods: {
    titleUserReplace() {
      return this.$t('sign.step-2-title').replace(
        '{user}',
        this.userStore.first_name
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/components/auth/__styles/form';

.accordion-content {
  &-title {
    @include fluid-size('margin-bottom', 25px, 35px);
  }

  ::v-deep {
    .expand-item:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
</style>
