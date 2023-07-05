"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeePayMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeePayMaster.init(
    {
      pay_master_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pay_month: DataTypes.INTEGER,
      run_date: DataTypes.DATE,
      gross_salary: DataTypes.INTEGER,
      income_tax: DataTypes.FLOAT,
      total_deductions: DataTypes.FLOAT,
      total_allowances: DataTypes.FLOAT,
      company_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EmployeePayMaster",
      tableName: "employee_pay_masters",
    }
  );
  return EmployeePayMaster;
};
