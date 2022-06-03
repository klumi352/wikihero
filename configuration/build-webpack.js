exports.build = {
  babel: {
    presets({ envName }) {
      const envTargets = {
        client: { browsers: ['last 2 versions'], ie: 11 },
        server: { node: 'current' }
      }
      return [
        [
          '@nuxt/babel-preset-app',
          {
            targets: envTargets[envName],
            useBuiltIns: 'usage'
          }
        ]
      ]
    },
    plugins: [
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator'
    ]
  },
  extend(config, { isDev, isClient, isServer }) {
    if (process.env.NODE_ENV === 'development' && isClient) {
      config.devtool = 'eval-source-map' // create sourcemaps
    }

    config.module.rules.push({
      test: /\.html$/i,
      loader: 'html-loader'
    })

    config.module.rules.push({
      test: /\.svgm$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: 11
                  }
                }
              ]
            ]
          }
        },
        {
          loader: 'vue-svg-loader',
          options: {
            svgo: {
              plugins: [
                { removeDoctype: true },
                { mergePaths: false },
                { convertShapeToPath: false },
                { removeComments: true },
                { removeViewBox: false }
              ]
            }
          }
        }
      ],
      exclude: [/(node_modules)/, /(assets)/]
    })
    /*
     ** Run ESLint on save
     */
    if (isDev && isClient) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }
  }
}
