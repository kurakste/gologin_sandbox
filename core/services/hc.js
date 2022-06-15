'use strict'

/*
 * Маршруты заглушки для проверки работоспособности
 */
module.exports = async function(fastify) {
  // Генерация шаблона
  const defaultPage = async function(req, reply) {
    return reply.view('index.html', {
      app: this.config.app,
      debug: this.config.debug,
      oas: this.config.custom.oas,
      og: {
        title: `Приложение ${this.config.app.name}`,
        description: `Версия ${this.config.app.release}, время запуска ${this.config.app.launch}`,
      }
    })
  }

  fastify.route({method: 'GET', url: '/', handler: defaultPage})
  fastify.route({method: 'GET', url: '/hc', handler: defaultPage, logLevel: 'warn'})

  // Проверка нагрузки сервера
  // https://github.com/fastify/under-pressure
  fastify.register(require('under-pressure'))
  fastify.route({
    method: 'GET',
    url: '/pressure',
    handler: () => fastify.memoryUsage(),
    logLevel: 'warn'
  })

  // Проверка на 503 - Gateway TimeOut
  // noinspection All
  fastify.route({
    method: 'GET',
    url: '/timeout',
    schema: {
      hide: true,
      query: {
        type: 'object',
        additionalProperties: false,
        properties: {ms: {type: 'integer', minimum: 1, default: 1000}}
      }
    },
    handler: async (req, reply) => {
      const timeout = req.query.ms

      const delay = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms))
      await delay(timeout)

      reply.statusCode = 200
      return {
        statusCode: reply.statusCode,
        message: 'Ok',
        timeout: reply.getResponseTime()
      }
    }
  })
}

// Для настройки префиксов используйте
// module.exports.autoPrefix = '/something'
// module.exports.prefixOverride = '/overriddenPrefix'

module.exports.autoload = true
