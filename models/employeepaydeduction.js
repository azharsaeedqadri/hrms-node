"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeePayDeduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeePayDeduction.init(
    {
      epd_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pay_master_id: DataTypes.BIGINT,
      deduction_id: DataTypes.INTEGER,
      deduction_type: DataTypes.INTEGER,
      total_deductions: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "EmployeePayDeduction",
      tableName: "employee_pay_deductions",
    }
  );
  return EmployeePayDeduction;
};
