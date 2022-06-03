/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
const path = require('path')
const http = require('http')
const https = require('https')
const fs = require('fs-extra')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV === 'development'

const TranslationRouter = require('./router/sync')

async function start() {
  // Init Nuxt.js
  let server
  const nuxt = new Nuxt(config)

  let { host, port } = nuxt.options.server
  if (process.env.NODE_ENV === 'development') port = 8081

  server = http.createServer(app)

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use('/api/v1/sync', TranslationRouter)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
