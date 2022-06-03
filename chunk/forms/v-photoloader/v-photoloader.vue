<template>
  <div class="user__avatar-wrap">
    <h5 v-if="title" class="user__loader-title a-ffr">{{ title }}</h5>
    <div class="user__avatar-limit-wrap">
      <div class="user__avatar-subwrap">
        <div class="user__preloader" :class="preload ? 'show-loader' : ''">
          <img
            class="ico"
            width="60"
            height="60"
            src="~assets/svg/icon-preloader.svg"
            alt=""
          />
        </div>
        <img :src="imgData" alt="" class="user__avatar" />
        <label>
          <button
            class="user__edit-btn g-btn g-btn--fill a-ffr"
            :disabled="disableMod"
            @click="callInput"
          >
            <icon-edit class="user__edit-ico"></icon-edit>
            {{ $t('setting.edit-text') }}
          </button>
          <input
            ref="hiddenInput"
            class="user__edit-input"
            type="file"
            src=""
            alt=""
            @change="showPhoto"
          />
        </label>
      </div>
    </div>
    <span
      v-if="error && imgData === 'assets/images/avatar.png'"
      class="error"
      >{{ error }}</span
    >
  </div>
</template>

<style lang="scss" scoped>
@import 'v-photoloader';
</style>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
import IconEdit from '@/chunk/__svg/icon-edit-3.svgm'

export default {
  components: {
    IconEdit
  },
  props: {
    imageUrl: {
      type: String
    },
    defaultImg: {
      type: String,
      default: 'assets/images/avatar.png'
    },
    disableMod: {
      type: Boolean
    },
    error: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      preload: false,
      imgData: this.defaultImg
    }
  },
  created() {
    this.imageUrl ? (this.imgData = this.imageUrl) : this.imgData
  },
  methods: {
    callInput() {
      this.$refs.hiddenInput.click()
    },
    showPhoto() {
      const fileInp = this.$refs.hiddenInput
      if (!fileInp.value) return
      // eslint-disable-next-line no-useless-catch
      try {
        this.preload = true
        const [file] = fileInp.files
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
          this.imgData = e.target.result
        })
        reader.readAsDataURL(file)
        this.$emit('upload', file)
      } catch (e) {
        this.$notification.error('smth')
      } finally {
        setTimeout(() => {
          this.preload = false
        }, 150)
      }
    }
  }
}
</script>
