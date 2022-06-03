<template>
  <div class="area-input__wrapper a-df a-fdc">
    <textarea
      ref="textarea"
      rows="1"
      :value="areaValue"
      class="area-input"
      :placeholder="placeholderValue"
      name="body"
      :class="{ error: errorValue }"
      @input="handle"
    ></textarea>
    <span v-if="errorValue" class="message-error">{{ errorValue }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import 'v-text-area.scss';
</style>

<script>
export default {
  props: {
    areaValue: String,
    placeholderValue: String,
    errorValue: String
  },
  watch: {
    areaValue: {
      handler(e) {
        if (e) {
          this.$nextTick(() => {
            this.resizeTextarea(this.$refs.textarea)
          })
        } else {
          this.$nextTick(() => {
            this.resizeTextarea(this.$refs.textarea)
          })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeTextarea(this.$refs.textarea)
    })
  },
  methods: {
    resizeTextarea(event) {
      event.style.height = 'auto'
      event.style.height = event.scrollHeight + 'px'
      this.$refs.textarea.setAttribute(
        'style',
        'height:' + this.$refs.textarea.scrollHeight + 'px;overflow-y:hidden;'
      )
    },
    handle(event) {
      this.$emit('area-change', event)
      this.resizeTextarea(this.$refs.textarea)
    }
  },
  render() {
    return this.$slots.default[0]
  }
}
</script>
