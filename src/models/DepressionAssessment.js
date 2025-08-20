const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DepressionAssessment extends Model {}

  DepressionAssessment.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      score: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      severity: { type: DataTypes.ENUM('none', 'mild', 'moderate', 'moderately severe', 'severe'), allowNull: false },
      completedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    },
    {
      sequelize,
      modelName: 'DepressionAssessment',
      tableName: 'depression_assessments',
      underscored: true
    }
  );

  return DepressionAssessment;
};
