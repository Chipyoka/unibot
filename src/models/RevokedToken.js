const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RevokedToken extends Model {}

  RevokedToken.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      token: { type: DataTypes.STRING(500), allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false }
    },
    {
      sequelize,
      modelName: 'RevokedToken',
      tableName: 'revoked_tokens',
      underscored: true
    }
  );

  return RevokedToken;
};
