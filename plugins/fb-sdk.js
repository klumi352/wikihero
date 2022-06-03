import Vue from 'vue'

const VueFB = {
  install(Vue, options) {
    // eslint-disable-next-line no-console
    console.warn('FACEBOOK_CLIENT', process.env.FACEBOOK_CLIENT)
    ;(function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      const js = d.createElement(s)
      js.id = id
      js.src = process.env.FACEBOOK_SDK_LINK
      fjs.parentNode.insertBefore(js, fjs)
      // eslint-disable-next-line no-console
      console.info('setting fb sdk')
    })(document, 'script', 'facebook-jssdk')

    window.fbAsyncInit = function onSDKInit() {
      window.FB.init(options)
      window.FB.AppEvents.logPageView()
      Vue.FB = window.FB
      window.dispatchEvent(new Event('fb-sdk-ready'))
    }
    Vue.FB = null
    console.info({
      SDK_FACEBOOK_MESSAGE: 'setting fb sdk -> crashed'
    })
  }
}

Vue.use(VueFB, {
  appId: process.env.FACEBOOK_CLIENT,
  autoLogAppEvents: true,
  xfbml: true,
  version: process.env.FACEBOOK_VERSION
})
