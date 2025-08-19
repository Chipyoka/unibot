const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    toSafeJSON() {
      const { id, email, fullName, role, createdAt, updatedAt } = this.get();
      return { id, email, fullName, role, createdAt, updatedAt };
    }
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      fullName: { type: DataTypes.STRING(120), allowNull: false },
      role: { type: DataTypes.ENUM('student', 'counsellor', 'admin'), allowNull: false, defaultValue: 'student' },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true
    }
  );

  return User;
};
