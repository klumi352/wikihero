export default {
  /*
   ** Common values
   */
  get width() {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
  },
  get height() {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    )
  },
  get scrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop
  },
  get scrollTopCenter() {
    return this.scrollTop + this.height / 2
  },
  get scrollPercent() {
    return (
      ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
          document.documentElement.clientHeight)) *
      100
    )
  },
  get allHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  },
  /**
   * @param {external:Node} node
   */
  getAbsHeight(el) {
    const styles = window.getComputedStyle(el)
    const margin =
      parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)
    return Math.ceil(el.offsetHeight + margin)
  },
  /**
   * @param {external:Node} node
   */
  getAbsWidth(el) {
    const styles = window.getComputedStyle(el)
    const margin =
      parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)
    return Math.ceil(el.offsetWidth + margin)
  },
  /**
   * @param {external:Node} node
   */
  distanceTop(el) {
    return window.pageYOffset + el.getBoundingClientRect().top
  },
  /**
   * @param {external:Node} node
   */
  bounds(el) {
    return el.getBoundingClientRect()
  },
  /**
   * @param {external:Node} node
   */
  getHeight(el) {
    try {
      return {
        client: el.clientHeight,
        offset: el.offsetHeight
      }
    } catch (e) {
      return {
        client: undefined,
        offset: undefined
      }
    }
  },
  /**
   * @param {external:Node} node
   */
  getWidth(el) {
    try {
      return {
        client: el.clientWidth,
        offset: el.offsetWidth
      }
    } catch (e) {
      return {
        client: undefined,
        offset: undefined
      }
    }
  }
}
