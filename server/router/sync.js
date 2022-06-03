/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

const fs = require('fs')
const express = require('express')
const request = require('request')

const { Api } = require('../../api.config')
const { Router } = express
const router = Router()

require('dotenv').config()

const getFilePath = (fileName) => {
  // return `./.nuxt/dist/client/${fileName}.json`
  return `./static/${fileName}.json`
}

const clientServerOptions = (path) => ({
  uri: process.env.PROD_API + path,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})

const handler = (apiPath, wrPath, req, res) => {
  request(clientServerOptions(apiPath), (error, response) => {
    if (error) {
      res.status(404).send(`Not found ${error}`)
    } else {
      fs.writeFile(wrPath, response.body, 'utf8', (error, sucess) => {
        if (error) {
          res.status(404).send(`Not found ${error}`)
        } else {
          res.status(201).send('Translates was created')
        }
      })
    }
  })
}

router.post(
  '/translations',
  handler.bind(null, Api.client.TRANSLATION_ALL, getFilePath('translations'))
)

router.post(
  '/images',
  handler.bind(null, Api.client.IMAGE_ALL, getFilePath('images'))
)

module.exports = router
