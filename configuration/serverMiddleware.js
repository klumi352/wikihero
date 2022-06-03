exports.serverMiddleware = [
  function(req, res, next) {
    let url = req.url

    /** Redirect to only lowerCase */
    if (url !== url.toLowerCase()) {
      url = url.toLowerCase()
      res.writeHead(301, { Location: url })
      return res.end()
    }

    /** Trim last slash */
    if (/.{1,}\/$/.test(req.url)) {
      const url = req.url.replace(/\/$/, '')
      res.writeHead(301, { Location: url })
      return res.end()
    }

    /** Cut slash more one */
    if (/\/{2,}/.test(url)) {
      url = url.replace(/\/{2,}/g, '/')
      res.writeHead(301, { Location: url })
      return res.end()
    }
    next()
  }
]
