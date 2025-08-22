'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('AdminPass@123', 12);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@themchar.com',
        password_hash: passwordHash,
        full_name: 'Super Admin',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@themchar.com' });
  }
};
