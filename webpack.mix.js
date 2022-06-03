/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path')
const webpack = require('webpack')
const mix = require('laravel-mix')
const translation = require('./__external/public/translations')
/*
 |--------------------------------------------------------------------------
 | ! IMPORTANT: using only for __external folder (widget for embeded link)
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */
const DefinePlugin = webpack.DefinePlugin

mix.js('__external/assets/js/embed-widget.js', '__external/public').version()
mix.setPublicPath('__external/public')
mix.webpackConfig({
  devServer: {
    port: '9999'
  },
  resolve: {
    alias: {
      '@@': '__external/assets',
      '@': path.resolve(__dirname)
    }
  },
  plugins: [
    new DefinePlugin({
      'process.translation': JSON.stringify(translation)
    })
  ],
  module: {
    rules: [
      {
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
      }
    ]
  }
})
