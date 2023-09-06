"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeMonthlyPayroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeMonthlyPayroll.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      epf_employer: DataTypes.INTEGER,
      total_gs_allowances: DataTypes.INTEGER,
      taxable_salary: DataTypes.INTEGER,
      deductions: DataTypes.INTEGER,
      epf_employee: DataTypes.INTEGER,
      reimbursement: DataTypes.INTEGER,
      net_salary: DataTypes.INTEGER,
      is_locked: DataTypes.BOOLEAN,
      payslip: DataTypes.STRING,
      payroll_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EmployeeMonthlyPayroll",
      tableName: "employee_monthly_payrolls",
    }
  );
  return EmployeeMonthlyPayroll;
};
