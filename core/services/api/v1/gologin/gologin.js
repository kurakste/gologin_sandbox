'use strict'

/**
 * Эндпоинты для работы с профилями GoLogin
 */

const GoLogin = require('gologin')
const createProfileSchema = require("./_createProfileSchema");

const bearer = [{AccessTokenBearer: []}]
const tag = ['GoLogin']

module.exports = async function (fastify) {
  const createProfileSchema = require('./_createProfileSchema')
  // POST /gologin/profile
  // noinspection JSCheckFunctionSignatures
  fastify.route({
    method: 'POST',
    url: '/profile',
    schema: {
      tags: tag,
      summary: '# Создать новый профайл пользователя.',
      description:
        '## Создать новый профайл пользователя.\n\n',
      produces: ['text/html'],
      body: createProfileSchema,
      response: {
        200: {
          type: 'object', properties: {
            profileId: {type: 'string', description: 'id созданного профайла'}
          }
        }
      }
    },
    handler: async (req, resp) => {
      const GOLOGIN_API_TOKEN = fastify.config.custom.goLogin.apiToken
      const GL = new GoLogin({
        token: GOLOGIN_API_TOKEN
      })
      try {

        const params = req.body
        const profileId = await GL.create(params)
        return resp.code(200).send({profileId})
      } catch (e) {
        console.log(e)
      }
    }
  })

  // PATCH /gologin/profile
  // noinspection JSCheckFunctionSignatures
  const patchProfileSchema = require('./_patchProfileSchema')
  fastify.route({
    method: 'PATCH',
    url: '/profile/:profileId',
    schema: {
      tags: tag,
      summary: '# Изменить профайл пользователя.',
      description:
        '## Изменить профайл пользователя.\n\n',
      produces: ['text/html'],
      params: {
        profileId: {type: 'string', description: 'id профайла который нужно изменить.'}
      },
      body: patchProfileSchema,
      response: {}
    },
    handler: async (req, resp) => {
      const GOLOGIN_API_TOKEN = fastify.config.custom.goLogin.apiToken
      const GL = new GoLogin({token: GOLOGIN_API_TOKEN})
      try {
        await GL.update({id: req.params.profileId, ...req.body})
      } catch (e) {
        if (e.message = 'data is not defined') {
          throw fastify.httpErrors.notFound('Профиль с заданным ID не найден.')
        } else {
          throw e
        }
      }
      return resp.code(204).send()
    }
  })

  // POST /gologin/profile/start
  // noinspection JSCheckFunctionSignatures
  fastify.route({
    method: 'POST',
    url: '/profile/start',
    schema: {
      tags: tag,
      summary: '# Запустить пользователя.',
      description:
        '## Запустить профайл пользователя.\n\n',
      produces: ['text/html'],
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['profileId'],
        properties: {profileId: {type: 'string', description: 'id профайла'}}
      },
      response: {
        201: {
          type: 'object', properties: {
            status: {type: 'string', description: 'Тестовый статус запуска', example: 'Ok'},
            wsUrl: {type: 'string', description: 'Строка подключения к WS соединению'}
          }
        }
      }
    },
    handler: async (req, resp) => {
      const GOLOGIN_API_TOKEN = fastify.config.custom.goLogin.apiToken
      const GL = new GoLogin({
        token: GOLOGIN_API_TOKEN,
        profile_id: req.body.profileId,
      })
      const {status, wsUrl} = await GL.start()
      return resp.code(201).send({status, wsUrl})
    }
  })

  // POST /gologin/profile/stop
  // noinspection JSCheckFunctionSignatures
  fastify.route({
    method: 'POST',
    url: '/profile/stop',
    schema: {
      tags: tag,
      summary: '# Остановить профайл пользователя.',
      description:
        '## Остановить профайл пользователя.\n\n',
      produces: ['text/html'],
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['profileId'],
        properties: {profileId: {type: 'string', description: 'id профайла'}}
      },
      response: {
        201: {type: 'object'},
      }
    },
    handler: async (req, resp) => {
      const GOLOGIN_API_TOKEN = fastify.config.custom.goLogin.apiToken
      const GL = new GoLogin({
        token: GOLOGIN_API_TOKEN,
        profile_id: req.body.profileId,
      })
      const tmp = await GL.stop()
      return resp.code(204).send()
    }
  })

}

module.exports.autoload = true
