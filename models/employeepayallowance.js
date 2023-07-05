"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeePayAllowance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeePayAllowance.init(
    {
      epa_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pay_master_id: DataTypes.BIGINT,
      allowance_id: DataTypes.INTEGER,
      allowance_type: DataTypes.INTEGER,
      is_fixed: DataTypes.BOOLEAN,
      allowance_amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "EmployeePayAllowance",
      tableName: "employee_pay_allowances",
    }
  );
  return EmployeePayAllowance;
};
