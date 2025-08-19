const { Sequelize } = require('sequelize');
const dbCfg = require('../config/db');
const env = require('../config/environment');

const cfg = dbCfg[env.nodeEnv] || dbCfg.development;
const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);

// Import models
const User = require('./User')(sequelize);
const RevokedToken = require('./RevokedToken')(sequelize);

// Export all models
module.exports = { sequelize, Sequelize, User, RevokedToken };
