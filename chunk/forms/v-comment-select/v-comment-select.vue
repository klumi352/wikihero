<template>
  <div class="select" :class="setClasses">
    <button v-click-outside="hide" class="select-btn a-ffr" @click="open">
      {{ currentType }}<icon-arrow class="select-arrow" />
    </button>
    <div class="select-modal-wrap">
      <ul class="select-modal">
        <li v-for="(item, index) in typeList" :key="index">
          <button
            v-if="!item.selected"
            class="select-option a-ffr"
            @click="sorting(item)"
          >
            {{ item.title }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  directives: {
    ClickOutside
  },
  data() {
    const vm = this
    return {
      typeList: [
        {
          title: vm.$t('comment.old-comments-list'),
          type: 'old-comment',
          selected: true
        },
        {
          title: vm.$t('comment.recent-comment-list'),
          type: 'new-comment',
          selected: false
        },
        {
          title: vm.$t('comment.popular-comment-list'),
          type: 'popular',
          selected: false
        }
      ],
      currentType: vm.$t('comment.old-comments-list'),
      isOpen: false
    }
  },
  computed: {
    setClasses() {
      return {
        openSelect: this.isOpen
      }
    }
  },
  methods: {
    hide() {
      this.isOpen = false
    },
    open() {
      this.isOpen = !this.isOpen
    },
    sorting(v) {
      this.typeList.forEach((item) => {
        item.selected = false
      })
      this.currentType = v.title
      v.selected = true
      this.$emit('comment-sorting', v.type)
    }
  }
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  margin-bottom: 10px;

  &-btn {
    padding: 10px 35px 10px 9px;
    position: relative;
    font-size: 15px;
    line-height: 17px;
    color: #000000;
    border: none;
    background: none;
    cursor: pointer;
    z-index: 10;
    background-color: white;
    user-select: none;
  }

  &-modal-wrap {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    transition: all 0.2s;
    bottom: 0;
    top: 30px;
    z-index: 1;

    .openSelect & {
      opacity: 1;
      visibility: visible;
      z-index: 11;
    }
  }

  &-modal {
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    border: 1px solid #e2e2e2;
  }

  &-option {
    font-size: 15px;
    line-height: 17px;
    color: #000000;
    padding: 10px 9px;
    cursor: pointer;
    border: none;
    background: none;
    background-color: white;
    user-select: none;
  }

  &-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: rotate(0deg) translateY(-50%);
    transition: all 0.2s;
    width: 15px;
    height: 10px;

    path {
      transition: all 0.2s;
    }

    .openSelect & {
      transform: translateY(-50%) rotate(-180deg);
    }
  }
}
</style>
