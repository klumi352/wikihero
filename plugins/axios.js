/* eslint-disable @typescript-eslint/no-unused-vars */
// const Cookie = process.client ? require('js-cookie') : undefined
const fetchLoading = (key /* 'add' | 'remove' */) => {
  if (process.client) {
    document.documentElement.classList[key]('fetch-loading')
  }
}

export default function(ctx) {
  ctx.$axios.defaults.baseURL = process.env.API_URL
  if (process.client) {
    ctx.store.dispatch('auth/updateAxiosConfig')
  }

  ctx.$axios.interceptors.request.use((config) => {
    if (process.client) fetchLoading('add')
    return config
  })

  ctx.$axios.onRequest((config) => {
    // eslint-disable-next-line no-console
    console.info('Making request to ' + config.url)
  })

  ctx.$axios.interceptors.response.use(
    function(response) {
      /** Interceptop for API request */
      fetchLoading('remove')
      if (!response.data && response.status === 200) {
        throw new Error('NO_DATA_WRAPPER')
      }
      return response.data
    },
    function(error) {
      /** Error handler */
      fetchLoading('remove')
      return Promise.reject(error)
    }
  )

  ctx.$axios.onError((error) => {
    const status = parseInt(error.response && error.response.status)

    if (status === 401 && process.client) {
      ctx.store.dispatch('auth/logout')
    }
    if (/(?!([45]0[0-9]))\d{3}/.test(status)) {
      // ctx.errorNuxt({ status, message: `Request with ${status} error` })
    }
  })
}
