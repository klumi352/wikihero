export default function({ store, error }) {
  if (!store.getters['auth/isAdmin']) {
    error({ statusCode: 404 })
  }
}
