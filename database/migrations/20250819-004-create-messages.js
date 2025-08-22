'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      session_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'chat_sessions', key: 'id' } },
      sender: { type: Sequelize.ENUM('user','student', 'bot'), allowNull: false },
      text: { type: Sequelize.TEXT, allowNull: false },
      sentiment: { type: Sequelize.STRING, allowNull: true },
      sentiment_score: { type: Sequelize.FLOAT, allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  }
};
