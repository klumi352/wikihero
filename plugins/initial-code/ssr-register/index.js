import Vue from 'vue'
import vSelect from 'vue-select'

import { dynamic } from '~/helpers/load-dynamic'

Vue.component('vue-select', vSelect)

const webpackGlobalResolveConfig = [
  require.context('~/chunk/__svg', true, /\.svgm/),
  require.context('~/chunk/modules', true, /\.vue/),
  require.context('~/chunk/common', true, /\.vue/),
  require.context('~/chunk/forms', true, /\.vue/)
]
/**
 * All global modules
 */
const globalComponents = []
webpackGlobalResolveConfig.forEach((context) => {
  const components = dynamic(context)
  Object.entries(components).forEach(([name, Module]) => {
    globalComponents.push(name)
    Vue.component(name, Module)
  })
})
