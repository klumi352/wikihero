import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export const dynamic = function(context) {
  const components = {}
  context.keys().forEach((fileName) => {
    // Get config context
    const componentConfig = context(fileName)
    // Get component name in PascalCase
    const componentName = upperFirst(
      camelCase(
        // Get file name
        fileName
          .split('/')
          .pop()
          .replace(/\.\w+.*$/, '')
      )
    )
    // Global registration
    components[componentName] = componentConfig.default || componentConfig
  })

  return components
}
