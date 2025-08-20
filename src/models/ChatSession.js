const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatSession extends Model {}

  ChatSession.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      status: { type: DataTypes.ENUM('active', 'closed'), allowNull: false, defaultValue: 'active' },
      startedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      endedAt: { type: DataTypes.DATE, allowNull: true }
    },
    {
      sequelize,
      modelName: 'ChatSession',
      tableName: 'chat_sessions',
      underscored: true
    }
  );

  return ChatSession;
};
