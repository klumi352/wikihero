import Vue from 'vue'
import throttle from 'lodash/throttle'
import sizes from '@/helpers/dom/sizes'

function optiresizeListener() {
  document.documentElement.style.setProperty('--vh', `${sizes.height}px`)
}
optiresizeListener()
const resizeHandler = throttle(optiresizeListener, 500)
window.addEventListener('resize', resizeHandler)

Vue.prototype.$copyTextToClipboard = function(copyText) {
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed' // avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      const msg = successful ? 'successful' : 'unsuccessful'
      // eslint-disable-next-line no-console
      console.log('Fallback: Copying text command was ' + msg)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fallback: Oops, unable to copy', err)
    }

    document.body.removeChild(textArea)
  }

  return new Promise((resolve) => {
    const text = copyText
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text)
      resolve()
      return
    }
    navigator.clipboard.writeText(text).then(
      function() {
        // eslint-disable-next-line no-console
        console.log('Async: Copying to clipboard was successful!')
        resolve()
      },
      function(err) {
        // eslint-disable-next-line no-console
        console.error('Async: Could not copy text: ', err)
      }
    )
  })
}
/**
 * Focus handler
 */
const TAB_FOCUS_CLASS = 'g-tab-focus'
document.addEventListener('click', () => {
  document.documentElement.classList.remove(TAB_FOCUS_CLASS)
})
window.addEventListener('keyup', (e) => {
  if (
    e.keyCode === 9 && // tab button
    !document.documentElement.classList.contains(TAB_FOCUS_CLASS)
  ) {
    document.documentElement.classList.add(TAB_FOCUS_CLASS)
  }
})

/**
 * Focus handler
 */
;(() => {
  let lastScrollTop = 0
  const html = document.documentElement
  const setProp = (name, value) =>
    document.documentElement.style.setProperty(name, value)

  {
    const h = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const absoluteHeight = sizes.getAbsHeight(html) - 20
      const absoluteScroll = sizes.height + sizes.scrollTop

      if (absoluteScroll > absoluteHeight) {
        html.classList.remove('scroll-dir-up')
        html.classList.add('scroll-dir-down')
      } else if (scrollTop > lastScrollTop) {
        html.classList.remove('scroll-dir-up')
        html.classList.add('scroll-dir-down')
      } else {
        html.classList.remove('scroll-dir-down')
        html.classList.add('scroll-dir-up')
      }

      setTimeout(() => (lastScrollTop = scrollTop <= 0 ? 0 : scrollTop), 100)

      setTimeout(() => {
        document.documentElement.classList[
          sizes.scrollTop > 50 ? 'add' : 'remove'
        ]('g-fixed')

        setProp('--scroll-y', `${sizes.scrollTop}px`)
        setProp('--scroll-per', sizes.scrollPercent)
      })
    }
    h()
    document.addEventListener('scroll', throttle(h, 250))
  }
})()

history.scrollRestoration = 'manual'
