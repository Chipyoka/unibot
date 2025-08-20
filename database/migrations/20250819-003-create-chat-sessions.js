'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_sessions', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' } },
      status: { type: Sequelize.ENUM('active', 'closed'), allowNull: false, defaultValue: 'active' },
      started_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      ended_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('chat_sessions');
  }
};
