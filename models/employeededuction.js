"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeDeduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      models.EmployeeDeduction.belongsTo(models.Deduction, {
        foreignKey: "deduction_id",
      });

      // define association here
    }
  }
  EmployeeDeduction.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      deduction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      percentage: DataTypes.FLOAT,
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "EmployeeDeduction",
      tableName: "employee_deductions",
    }
  );
  return EmployeeDeduction;
};
