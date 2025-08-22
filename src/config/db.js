const env = require('./environment');

module.exports = {
  development: {
    username: env.db.user,
    password: env.db.pass,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: env.db.user,
    password: env.db.pass,
    database: `${env.db.name}_test`,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: env.db.user,
    password: env.db.pass,
    database: env.db.name,
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: false
  }
};
