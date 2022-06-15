'use strict'

/*
 * Application launch file
 *
 * Fastify: https://www.fastify.io
 * Extend your server: https://www.fastify.io/ecosystem
 */

const config = require('./config')
const autoLoad = require('fastify-autoload')

// Basic server settings
// https://www.fastify.io/docs/latest/Server
// noinspection JSUnusedGlobalSymbols
const opts = Object.assign(
  {
    maxParamLength: 300,
    pluginTimeout: 15000,
    requestIdHeader: 'x-trace-id',
    genReqId: require('hyperid')({fixedLength: true, urlSaf: true}),
    logger: {
      level: config.logLevel,
      prettyPrint: config.debug ? {translateTime: 'HH:MM:ss.l'} : false,
      base: null
    },
    ajv: {
      // https://ajv.js.org/#options
      customOptions: {
        unknownFormats: ['binary'],
        removeAdditional: false,
        allErrors: true,
        nullable: true,
        verbose: true,
        messages: true
      }
    }
  },
  config.opts
)

// Create server
const fastify = require('fastify')(opts)
require('make-promises-safe')

// To have accepts in your request object
// https://github.com/fastify/fastify-accepts
if (config.plugins.accepts) fastify.register(require('fastify-accepts'))

// Supports gzip, deflate
// Поддержка gzip сжатия ответов
// https://github.com/fastify/fastify-compress
if (config.plugins.compress)
  fastify.register(require('fastify-compress'), {
    global: true,
    encodings: ['gzip', 'deflate']
  })

// Enables the use of CORS
// https://github.com/fastify/fastify-cors
if (config.plugins.cors) fastify.register(require('fastify-cors'))

// Important security headers
// https://github.com/fastify/fastify-helmet
if (config.plugins.helmet)
  fastify.register(require('fastify-helmet'), {
    referrerPolicy: {policy: 'no-referrer'},
    contentSecurityPolicy: false
  })

// Multipart support
// https://github.com/fastify/fastify-multipart
if (config.plugins.multipart) fastify.register(require('fastify-multipart'))

// A low overhead rate limiter for your routes
// Ограничение количества запросов для пользователя
// https://github.com/fastify/fastify-rate-limit
if (config.plugins.rateLimit)
  fastify.register(require('fastify-rate-limit'), {
    max: 300
  })

// Request-scoped storage, based on AsyncLocalStorage
// https://github.com/fastify/fastify-request-context
if (config.plugins.context) {
  const {fastifyRequestContextPlugin} = require('fastify-request-context')
  fastify.register(fastifyRequestContextPlugin)
}

// Adds some useful decorators such as http errors and assertions
// https://github.com/fastify/fastify-sensible
if (config.plugins.sensible)
  fastify.register(require('fastify-sensible'), {
    errorHandler: !config.debug
  })

// Plugin for serving storage files as fast as possible
// https://github.com/fastify/fastify-static

fastify.register((instance, opts, next) => {
  instance.register(require('fastify-static'), {
    root: config.path.static,
    prefix: '/static',
    prefixAvoidTrailingSlash: false,
    wildcard: true,
    index: false,
    etag: false,
    maxAge: config.debug ? 0 : '180s',
    list: false
  })
  // here `reply.sendFile` refers to 'node_modules' files

  next()
})

fastify.register((instance, opts, next) => {
  instance.register(require('fastify-static'), {
    root: config.path.uploads,
    prefix: '/uploads',
    prefixAvoidTrailingSlash: false,
    wildcard: true,
    index: false,
    etag: false,
    maxAge: config.debug ? 0 : '180s',
    list: false,
    // добавил Эржигит
    cacheControl: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=600, immutable')
    }
  })
  // here `reply.sendFile` refers to 'node_modules' files
  next()
})


// Templates rendering plugin support
// https://github.com/fastify/point-of-view
if (config.plugins.render) {
  const minifier = require('html-minifier')
  const minifierOpts = {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true
  }
  fastify.register(require('point-of-view'), {
    engine: {ejs: require('ejs')},
    root: config.path.templates,
    options: config.debug
      ? {}
      : {
        useHtmlMinifier: minifier,
        htmlMinifierOptions: minifierOpts
      }
  })
}

// Registering a decorator to access settings
fastify.decorate('config', config)

// Adding an identifier to the response header
fastify.addHook('onRequest', (req, reply, done) => {
  reply.header('X-Trace-Id', req.id)
  done()
})

// Logging the content of requests
fastify.addHook('preValidation', (req, reply, done) => {
  const log = {}
  if (req.raw.headers && Object.keys(req.raw.headers).length) log['headers'] = req.raw.headers
  ;
  ['params', 'query', 'body'].forEach((x) => {
    if (req[x] && Object.keys(req[x]).length) log[x] = req[x]
  })
  req.log.debug(log, `parsed request`)
  done()
})

// Loading your custom plugins [./core/plugins]
// Загрузка пользовательских плагинов
fastify.register(
  autoLoad,
  Object.assign(
    {
      dir: config.path.plugins,
      ignorePattern: /^(?:_|lib\.).*/i
    },
    config.autoLoad
  )
)

// Loading your custom services [./core/services]
fastify.register(
  autoLoad,
  Object.assign(
    {
      dir: config.path.services,
      ignorePattern: /^(?:_|lib\.).*/i
    },
    config.autoLoad
  )
)

// Logging the content of response
// Печать параметров ответа в режиме FST_LOG_LEVEL='debug'
fastify.addHook('onSend', (req, reply, payload, done) => {
  const log = {}
  log['headers'] = reply.getHeaders()
  log['payload'] = !payload ? null : typeof payload
  if (!!payload && typeof payload === 'string') {
    if (payload.length <= 300) {
      try {
        log['payload'] = JSON.parse(payload.toString())
      } catch (ex) {
        log['payload'] = payload
      }
    } else log['payload'] = payload.toString().slice(0, 300) + '...'
  }
  req.log.debug(log, `parsed response`)
  done(null, payload)
})

// fastify.setErrorHandler(function (error, request, reply) {
//   if (error.validation) {
//     const dopInfo = error.validation
//       .map(el=> {
//         if (el.keyword !== 'additionalProperties') return ''
//         return `Дополнительное полe: ${el.params.additionalProperty}`
//       })
//       .join(';')
//     error.message = error.message + '. ' + dopInfo
//     reply.status(400).send(error)
//   }
// })
module.exports = {fastify}
