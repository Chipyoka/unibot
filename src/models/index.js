const { Sequelize } = require('sequelize');
const dbCfg = require('../config/db');
const env = require('../config/environment');

let sequelize;

// Use full DATABASE_URL in production (Render)
if (env.nodeEnv === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set in production');
  }

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Development / Test
  const cfg = dbCfg[env.nodeEnv] || dbCfg.development;
  sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
}

// Models
const User = require('./User')(sequelize);
const ChatSession = require('./ChatSession')(sequelize);
const Message = require('./Message')(sequelize);
const DepressionAssessment = require('./DepressionAssessment')(sequelize);
const RevokedToken = require('./RevokedToken')(sequelize);

// Associations
User.hasMany(ChatSession, { foreignKey: 'userId' });
ChatSession.belongsTo(User, { foreignKey: 'userId' });

ChatSession.hasMany(Message, { foreignKey: 'sessionId' });
Message.belongsTo(ChatSession, { foreignKey: 'sessionId' });

User.hasMany(DepressionAssessment, { foreignKey: 'userId' });
DepressionAssessment.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  ChatSession,
  Message,
  DepressionAssessment,
  RevokedToken
};
