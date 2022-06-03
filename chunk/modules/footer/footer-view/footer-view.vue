<template>
  <!-- eslint-disable vue/no-v-html  -->
  <footer class="footer">
    <div class="g-container g-aside-container">
      <div class="wrapper">
        <div class="col intro">
          <div class="notice" v-html="$t('footer.text')"></div>
          <p class="txt a-fz-16-18">
            {{ $t('footer.intro') }}
          </p>
          <p>
            <a class="g-link a-fz-16-18" :href="$t('footer.link')">{{
              $t('footer.link-text')
            }}</a>
          </p>
        </div>
        <div class="col">
          <div class="g-h3">{{ $t('footer.1st-menu') }}</div>
          <ul>
            <li class="item">
              <nuxt-link class="link g-link g-link--dark" to="/about-us">{{
                $t('footer.about-page')
              }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link class="link g-link g-link--dark" to="/faq">{{
                $t('footer.faq-page')
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col">
          <div class="g-h3">{{ $t('footer.2st-menu') }}</div>
          <ul>
            <li class="item">
              <nuxt-link class="link g-link g-link--dark" to="/terms">{{
                $t('footer.terms-page')
              }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link class="link g-link g-link--dark" to="/privacy">{{
                $t('footer.privacy-page')
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col">
          <div class="g-h3">{{ $t('footer.3st-menu') }}</div>
          <ul>
            <li class="item">
              <a
                class="link g-link g-link--dark"
                :href="`mailto:${$t('footer.mail')}`"
                >{{ $t('footer.mail') }}</a
              >
            </li>
            <li class="item">
              <a
                class="link g-link g-link--dark"
                :href="`tel:${$t('footer.phone')}`"
                >{{ $t('footer.phone') }}</a
              >
            </li>
            <li class="item">
              <a
                class="whatsup"
                target="_blank"
                :href="
                  `https://api.whatsapp.com/send?phone=${$t(
                    'footer.wapp-phone'
                  )}`
                "
                ><icon-whatsapp-2 width="20" height="20" />
                {{ $t('footer.wapp-title') }}</a
              >
            </li>
          </ul>
          <footer-social />
        </div>
      </div>
      <div class="wrapper">
        <div class="copyright g-h3">{{ $t('footer.copyright') }}</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import FooterSocial from '../footer-social/footer-social.vue'

export default Vue.extend({
  localObserver() {
    return {
      single: () => this.$el
    }
  },
  components: {
    FooterSocial
  }
})
</script>

<style lang="scss" scoped>
@import 'footer-view';
</style>
