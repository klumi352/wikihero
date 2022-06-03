<template>
  <section class="sorting-bar">
    <ul class="a-df">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="sorting-bar__item a-df a-aic"
      >
        <button
          class="sorting-bar__button-sorting g-btn g-btn--link a-ffr"
          :class="[{ active: item.active }]"
          @click="sortHandle(index)"
        >
          {{ item.title }}
        </button>
        <span v-if="index !== data.length - 1" class="separator">&#183;</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [
        { title: 'Posts Récents', order_by: 'recent', active: true },
        { title: 'Tendances', order_by: 'trending', active: false },
        { title: 'Plus populaire', order_by: 'popular', active: false }
      ]
    }
  },
  methods: {
    sortHandle($index) {
      if (this.data[$index].active) return
      this.data.forEach((i) => {
        i.active = false
      })
      this.data[$index].active = true
      this.$emit('sort', this.data[$index].order_by)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'sorting-bar';
</style>
