/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default (ctx) => {
  const { isServer, route: next, from: current, app } = ctx
  // Don't use the middleware on server-side
  if (isServer /* || module.hot */) return

  // Return a promise to tell nuxt.js to wait for the end of it
  const toString = (x) => JSON.stringify(x)
  const showPreloader = app.router.app.$showPreloader
  if (!showPreloader) return true

  const currentQTrans = Boolean(current.meta.find((i) => i.queryTranstion))
  const nextQTrans = Boolean(next.meta.find((i) => i.queryTranstion))
  const withQuery = currentQTrans || nextQTrans

  const isNoTransition =
    next.meta.find((i) => i.noTransitionFrom)?.noTransitionFrom === current.name

  let inRouteOperation = false
  let inRouteChangeHash = false

  if (process.client) {
    inRouteOperation =
      /* the same route */
      current.name === next.name &&
      /* preloader only with query change */
      toString(current.query) !== toString(next.query) &&
      /* if change query need preloader { queryTranstion: true } for page */
      !withQuery

    inRouteChangeHash =
      /* the same route */
      current.name === next.name &&
      /* with hash change */
      (current.hash || next.hash)
  }

  if (inRouteChangeHash || inRouteOperation || isNoTransition) return true

  /** @Promise */
  return showPreloader()
}
