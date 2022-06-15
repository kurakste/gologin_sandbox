'use strict'

const {fastify} = require('./app')
const config = require('./config')

// Start server
// Запуск сервера
fastify.listen(Number(config.port), String(config.address), function(e) {
  if (e) {
    if (typeof e ==='MongooseError') {
      fastify.log.error(`DBase error: ${e.message}`)
    } else {
      console.error(e)
    }
    process.exit(1)
  }
})
