import Vue from 'vue'
import GAuth from 'vue-google-oauth2'

// eslint-disable-next-line no-console
console.warn('GOOGLE_CLIENT', process.env.GOOGLE_CLIENT)

const gauthOption = {
  clientId: process.env.GOOGLE_CLIENT,
  scope: 'profile email',
  prompt: 'select_account',
  fetch_basic_profile: false
}

Vue.use(GAuth, gauthOption)
