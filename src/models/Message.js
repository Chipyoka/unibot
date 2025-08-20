const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {}

  Message.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      sessionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      sender: { type: DataTypes.ENUM('user','student', 'bot'), allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
      sentiment: { type: DataTypes.STRING, allowNull: true }, // e.g., "positive", "negative"
      sentimentScore: { type: DataTypes.FLOAT, allowNull: true }, // e.g., 0.85
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      underscored: true
    }
  );

  return Message;
};
