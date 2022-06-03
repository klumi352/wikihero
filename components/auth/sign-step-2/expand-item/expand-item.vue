<template>
  <div class="expand-item" :class="{ active: height }">
    <div class="expand-item-title" @click="toggle">
      <span class="title-txt">
        {{ item.title }}
      </span>
      <span class="title-icon">
        <icon-expand />
      </span>
    </div>
    <div class="expand-item-wrap" :style="{ height: height }">
      <div ref="content" class="expand-item-content">
        <p>
          {{ item.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: Number,
    idx: Number,
    item: Object
  },
  data: () => ({
    height: 0,
    content: null
  }),
  watch: {
    active(val) {
      if (val !== this.idx) this.close()
    }
  },
  methods: {
    toggle() {
      this.content = this.$refs.content.offsetHeight
      if (!this.height) {
        this.height = `${this.content}px`
        setTimeout(() => (this.height = 'auto'), 350)
        this.$emit('open', this.idx)
      } else {
        this.height = `${this.content}px`
        setTimeout(() => (this.height = 0), 50)
      }
    },
    close() {
      if (this.height) {
        this.height = `${this.content}px`
        setTimeout(() => (this.height = 0), 50)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.expand-item {
  &.active {
    .title-icon {
      transform: rotate(-180deg);
    }
  }
  &-title {
    padding: 15px;
    border-radius: 5px;
    border: 1px solid var(--c-grey-light-3);
    font-family: $f-regular;
    line-height: 1.2;
    color: #000;
    display: flex;
    align-items: center;
    cursor: pointer;

    @include fluid-size('font-size', 16px, 19px);

    .title-txt {
      flex: 1 1 auto;
      margin-right: 15px;
    }

    .title-icon {
      flex: 0 0 auto;
      transition: all 0.4s;

      svg {
        display: block;
        width: 10px;
        height: 10px;
      }
    }
  }

  &-wrap {
    height: 0;
    overflow: hidden;
    transition: height 0.3s;
  }

  &-content {
    line-height: 1.2;
    padding: 15px 15px 15px 46px;
    font-family: $f-regular;
    color: #000;

    @include fluid-size('font-size', 16px, 19px);

    @include media-to(lg) {
      padding-left: 15px;
    }

    * {
      margin: 0;
      font-size: inherit;
      font-family: inherit;
      color: inherit;
    }
  }
}
</style>
