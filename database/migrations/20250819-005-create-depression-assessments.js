'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('depression_assessments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' } },
      score: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      severity: { 
        type: Sequelize.ENUM('none', 'mild', 'moderate', 'moderately severe', 'severe'),
        allowNull: false 
      },
      completed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('depression_assessments');
  }
};
