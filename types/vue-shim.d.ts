import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

interface Notify {
  (P: {
    title: string
    type?: 'error' | 'besic'
    group?: string
    text?: string
  }): void
}

interface Prompt {
  title?: string
  intro?: string
  confirmModal?: boolean
  textModal?: boolean
  closeAction?: (x: any) => any
  action?: (x: any) => Promise<any>
}

declare module 'vue/types/vue' {
  // 3. Объявите расширение для Vue
  interface VueConstructor {
    FB: any
    notify: Notify
    notification: any
    $showPrompt: (x: Prompt) => void
  }

  type matomoMethods = 'trackEvent' | 'trackSiteSearch' | any

  interface Vue {
    readonly _uid: number
    $gAuth: any
    $matomo: any
    $analytic: any
    $notify: Notify
    $notification: any
    $copyTextToClipboard: any
    $parseEntity: any
    $showPreloader: any
    $hidePreloader: any
    globalModals: any
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    pageLoader?: boolean
    globalObserver?: () => any
    localObserver?: () => any
  }
}
