/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue'
import VueMatomo from 'vue-matomo'
import { getUserId } from '@/store/auth'

export default function(ctx, inject) {
  const { app } = ctx
  const { user } = app.store.state.auth
  const isDev = process.env.NODE_ENV === 'development'

  const isEnable = (() => {
    switch (process.env.MATOMO_ENABLE) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return null
    }
  })()

  const isLoad = new Promise((resolve) => {
    const id = setInterval(() => {
      const m = Vue.prototype.$matomo
      if (m) {
        clearInterval(id)
        resolve(m)
      }
    }, 250)
  })

  const Analytic = async function(funcName, ...args) {
    const matomo = await isLoad
    matomo[funcName].apply(matomo, args)
  }

  Analytic.trackers = {
    /** test */
    test: {
      st1: () => Analytic('trackEvent', 'event-1', 'st1'),
      st2: () => Analytic('trackEvent', 'event-2', 'st2'),
      st3: () => Analytic('trackEvent', 'event-3', 'st3')
    },
    /** registration */
    goalRegistration: {
      redirectFromReward: () =>
        Analytic('trackEvent', 'Goal - Registration', 'redirect-reward'),
      moveToPage: () =>
        Analytic('trackEvent', 'Goal - Registration', 'move-to-page'),
      formValidate: () =>
        Analytic('trackEvent', 'Goal - Registration', 'form-validate-error'),
      /**
       * Main goals */
      successRegistration: () => Analytic('trackGoal', 1),
      successRegistrationReward: () => Analytic('trackGoal', 2)
    },
    registration: () => Analytic('trackEvent', 'registration', 'success'),

    /** modal */
    'contribute-tip': () => Analytic('trackEvent', 'modal', 'contribute-tip'),
    'suggest-link': () => Analytic('trackEvent', 'modal', 'suggest-link'),
    'validate-tip': () => Analytic('trackEvent', 'modal', 'validate-tip'),
    'validate-post': () => Analytic('trackEvent', 'modal', 'validate-tip')
  }

  inject('analytic', Analytic)

  const preInitActions = []

  Vue.use(VueMatomo, {
    host: isEnable && process.env.MATOMO_HOST,
    siteId: process.env.MATOMO_SITE_ID,
    router: app.router,
    debug: isDev,

    enableLinkTracking: true /*! isAdmin, */,
    trackInitialView: true /*! isAdmin, */,
    userId: getUserId(user),

    preInitActions

    /** Other configuration options **/
  })
}

/**
For ignore page / route
meta: {
  analyticsIgnore: true
}
 */
