<template>
  <div class="comments-wrap">
    <!-- Local preloader -->
    <div class="preloading" :class="[{ show: isLoadingTab }]">
      <img
        class="ico"
        width="60"
        height="60"
        src="~assets/svg/icon-preloader.svg"
        alt=""
      />
    </div>
    <!-- --- -->

    <h3 v-if="title" class="title" :class="{ profileUse }">
      {{ title }}
    </h3>

    <slot name="header" />

    <!-- Sorting bar section -->
    <SortingBar @sort="catchSortType"></SortingBar>
    <!-- --- -->

    <div v-if="hasData">
      <ul>
        <item
          v-for="(item, index) in pagination.data"
          :key="index"
          :item="item"
        ></item>
      </ul>

      <slot name="pagination">
        <div class="a-df a-jcc">
          <v-pagination
            class="buttons"
            :meta="pagination.meta"
            :loading="isLoading"
            @change="handlePagination"
          />
        </div>
      </slot>
    </div>

    <!-- <slot v-if="!hasData" name="no-result">
      <div class="search-result__no-data">
        <span>{{ $t('search.no-data') }}</span>
      </div>
    </slot> -->

    <!-- No found section -->
    <div v-else class="not-found">
      <div v-if="isLoaded">
        <img :src="$t(`$i.profile-wait.url`)" width="300" alt="" />
        <h2>{{ $t(`profile.empty-tip-${currSortProps}`) }}</h2>
        <nuxt-link
          :to="$t(`profile.empty-tip-${currSortProps}-link`)"
          class="g-btn"
          >{{ $t(`profile.empty-tip-${currSortProps}-btn`) }}</nuxt-link
        >
      </div>
    </div>
    <!-- --- -->
  </div>
</template>

<script>
import Item from '@/components/comments/item/item.vue'
import SortingBar from '@/chunk/common/sorting-bar/sorting-bar.vue'
import { SearchResultListMixin } from '~/plugins/vue-extend/mixins/-search-result-list-mixin'

export default SearchResultListMixin().extend({
  props: {
    profileUse: {
      type: Boolean
    },
    isLoading: {
      type: Boolean
    },
    isLoaded: {
      type: Boolean
    },
    isLoadingTab: {
      type: Boolean
    },
    currSortProps: {
      type: String,
      default: 'top'
    }
  },
  components: {
    Item,
    SortingBar
  },
  methods: {
    catchSortType(e) {
      this.$emit('sort', e)
    }
  }
})
</script>

<style lang="scss" scoped>
.comments-wrap {
  position: relative;
  min-height: 230px;

  .title {
    line-height: 1.2;
    color: var(--c-black);
    letter-spacing: 0.01em;
    font-family: $f-medium;

    @include fluid-size('margin-bottom', 25px, 42px);
    @include fluid-size('font-size', 22px, 27px);

    &.profileUse {
      padding-bottom: 10px;
      margin-bottom: 0;
      font-weight: normal;
      font-family: $f-regular;
      color: var(--c-grey-dark);
      @include fluid-size('font-size', 16px, 20px);
    }
  }
}

.not-found {
  min-height: 150px;
  padding: 50px 20px 20px;
  margin-bottom: 60px;

  img {
    margin-bottom: 30px;
  }

  h3 {
    color: var(--c-black);
  }

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.buttons {
  padding: 20px 0 5px;
}

.preloading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--c-preloader);
  visibility: hidden;
  opacity: 0;
  transition-property: opacity, visibility;
  transition-duration: 0.8s;
  min-height: 150px;

  /deep/svg {
    fill: var(--c-brand);
  }

  &.show {
    opacity: 1;
    transition-duration: 0.3s;
    visibility: visible;
  }
}
</style>
