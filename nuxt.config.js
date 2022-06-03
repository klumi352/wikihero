const { head } = require('./configuration/head')
const { router } = require('./configuration/router')
const { styles } = require('./configuration/styles')
const { plugins } = require('./configuration/modules-and-plugins')
const { serverMiddleware } = require('./configuration/serverMiddleware')
const { build } = require('./configuration/build-webpack')
const { env } = require('./configuration/build-environment')
const { pwa } = require('./configuration/build-environment')

module.exports = {
  mode: 'universal',
  loading: false,
  /** Env for nuxt plugins */
  env,
  /** Basic head configuration */
  head,
  /** PWA config */
  pwa,
  /** Express middlewares */
  serverMiddleware,
  /** Modules config */
  build,
  /** External & other modules */
  ...plugins,
  /** Router & transition config */
  ...router,
  /** SCSS & style resourses */
  ...styles
}
