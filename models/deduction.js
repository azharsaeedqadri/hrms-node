"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Deduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Deduction.belongsTo(models.AllowanceAndDeductionType, {
        foreignKey: "deduction_type",
      });
      models.AllowanceAndDeductionType.hasMany(models.Deduction, {
        foreignKey: "deduction_type",
      });
    }
  }
  Deduction.init(
    {
      deduction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      deduction_type: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
      percentage: DataTypes.FLOAT,
      is_fixed: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Deduction",
      tableName: "deductions",
    }
  );
  return Deduction;
};
