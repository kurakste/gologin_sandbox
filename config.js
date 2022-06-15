'use strict'

/*
 * Application settings
 */

require('dotenv').config()
const path = require('path')

// noinspection JSValidateTypes
process.env.UV_THREADPOOL_SIZE = 10

const getValue = (name, defaultValue = null, boolean = false) => {
  const bool = (x) => {
    const param = ['false', '0', 'none', 'null', '']
    return param.includes(String(x).toLowerCase()) ? false : Boolean(x)
  }
  const val = process.env[name] || defaultValue
  return boolean ? bool(val) : val
}
// TODO поставить блокирующую ошибку пои отсутствии переменных в .env
const config = {
  // Basic settings
  port: getValue('FST_PORT', 8080),
  address: getValue('FST_ADDRESS', '0.0.0.0'),
  logLevel: getValue('FST_LOG_LEVEL', process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  debug: process.env.NODE_ENV === 'development',
  test: getValue('FST_TEST', false),

  // Fastify instance settings
  // Настройки экземпляра fastify
  opts: {
    // Any settings described in the documentation
    // Любые настройки описанные в документации
    // https://www.fastify.io/docs/latest/Server
    connectionTimeout: +getValue('FST_CONNECTION_TIMEOUT', 180000),
    bodyLimit: 10485760, // === 10MB добавил, Эржигит
  },

  // AutoLoad plugin settings
  autoLoad: {
    // Any settings described in the documentation
    // Любые настройки описанные в документации
    // https://github.com/fastify/fastify-autoload
    dirNameRoutePrefix: true,
    maxDepth: 5
  },

  // Plugins settings
  // Настройки плагинов
  plugins: {
    accepts: getValue('FST_ACCEPTS', true, true),
    compress: getValue('FST_COMPRESS', false, true),
    cors: getValue('FST_CORS', false, true),
    helmet: getValue('FST_HELMET', true, true),
    multipart: getValue('FST_MULTIPART', true, true),
    rateLimit: getValue('FST_RATE_LIMIT', true, true),
    context: getValue('FST_CONTEXT', true, true),
    sensible: getValue('FST_SENSIBLE', true, true),
    static: getValue('FST_STATIC', true, true),
    render: getValue('FST_RENDER', true, true)
  },

  // Path settings
  path: {
    basedir: __dirname,
    core: path.join(__dirname, 'core'),
    plugins: path.join(__dirname, 'core', 'plugins'),
    services: path.join(__dirname, 'core', 'services'),
    static: path.join(__dirname, 'core', 'static'),
    uploads: path.join(__dirname, 'storage', 'uploads'),
    templates: path.join(__dirname, 'core', 'templates'),
    models: path.join(__dirname, 'core', 'models', 'sequelize'),
    schemes: path.join(__dirname, 'core', 'plugins', 'schemes'),
  },

  // Application Information
  // Информация о приложении
  app: {
    name: getValue('FST_APP_NAME', 'instance'),
    release: getValue('FST_APP_RELEASE', 'latest'),
    launch: getValue('FST_APP_LAUNCH', new Date().toISOString())
  },

  // Custom application settings
  // Пользовательские настройки приложения
  custom: {
    // Документация
    oas: {
      expose: getValue('FST_OAS_EXPOSE', false, true),
      user: getValue('FST_OAS_USER', Math.random().toString(16)),
      password: getValue('FST_OAS_PASSWORD', Math.random().toString(16))
    },

    // Настройка плагина logger
    logger: {
      active: getValue('FST_LOGGER_ACTIVE', false, true)
    },
    jwt: {
      key: getValue('JWT_KEY', false)
    },
    db: {
      user: getValue('DB_USER', false),
      password: getValue('DB_PASSWORD', false),
      name: getValue('DB_NAME', false),
      host: getValue('DB_HOST', false),
    },
    socketIo: {
      url: getValue('SOCKET_IO_URL', false),
      token: getValue('SOCKET_IO_TOKEN', false)
    },

    proxyTest: {
      skip: getValue('SKIP_PROXY_TEST', false)
    },
    goLogin: {
      apiToken: getValue('GOLOGIN_API_TOKEN', '')
    }


  }
}

module.exports = config
