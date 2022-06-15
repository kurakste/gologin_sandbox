const config = require('../config')

module.exports = {
  "development": {
    "username": config.custom.db.user,
    "password": config.custom.db.password,
    "database": config.custom.db.name,
    "host": config.custom.db.host,
    "dialect": "postgres"
  },
  "test": {
    "username": config.custom.db.user,
    "password": config.custom.db.password,
    "database": config.custom.db.name,
    "host": config.custom.db.host,
    "dialect": "postgres"
  },
  "production": {
    "username": config.custom.db.user,
    "password": config.custom.db.password,
    "database": config.custom.db.name,
    "host": config.custom.db.host,
    "dialect": "postgres"
  }
}
