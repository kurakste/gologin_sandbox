'use strict'

const navigatorSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    language: {type: 'string', description: 'Язык', example: 'enUS', default: 'enUS'},
    userAgent: {type: 'string', description: 'Браузер. Включая рандомный.', example: 'random', default: 'random'},// get random user agent for selected os
    resolution: {type: 'string', description: 'Разрешение экрана', example: '1024x768', default: '1024x768'},
    platform: {type: 'string', description: 'ID платформы', example: 'mac', default: 'mac'}
  }
}

const createProfileSchema = {
  type: 'object',
  properties: {
    name: {type: 'string', description: 'Название профиля', example: 'test_profile_1'},
    os: {type: 'string', description: 'Название ОС', example: 'mac', default: 'mac'},
    navigator: navigatorSchema
  }
}

module.exports = createProfileSchema
